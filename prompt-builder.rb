#!/usr/bin/env ruby
# frozen_string_literal: true

require "yaml"
require "fileutils"
require "open3"

USAGE = "usage: prompt-builder.rb <output_dir> <yaml_file> [yaml_file ...]"

# Build result codes for a single prompt build pipeline execution.
module BuildStatus
  Success          = 0
  YamlParseError   = 1
  SectionReadError = 2
  WriteError       = 3
  PatchError       = 4
end

# Validated prompt configuration parsed from a YAML file.
class PromptConfig
  # The display title placed at the top of the scaffolded output.
  # @return [String]
  attr_accessor :title

  # Output filename relative to the build output directory. Supports subdirectory paths.
  # @return [String]
  attr_accessor :filename

  # Key-value pairs in the format `tool_name.param_name: value` to define tool call overwrites.
  # @return [String]
  attr_accessor :tool_call_params

  # Ordered section identifiers, each a filename relative to the YAML file's directory.
  # @return [Array<String>]
  attr_accessor :sections

  # Ordered patch filenames relative to the YAML file's directory. May be empty.
  # @return [Array<String>]
  attr_accessor :patches
end

# Reads a file from disk and returns its raw contents.
#
# @param [String] path path to the file
# @return [String, nil] the raw file contents, or nil on any IO error
def read_file(path)
  return File.read(path)
rescue SystemCallError => e
  $stderr.puts("error: cannot read '#{path}': #{e.message}")
  return nil
end

# Parses a YAML prompt configuration file and validates its structure.
# YAML type coercion is suppressed via permitted_classes and aliases restrictions;
# all values are validated as plain strings and string arrays at runtime.
#
# @param [String] yaml_path path to the YAML configuration file
# @return [PromptConfig, nil] the validated configuration, or nil on any parse or schema error
def parse_config(yaml_path)
  raw = read_file(yaml_path)
  return nil if raw.nil?

  data = YAML.safe_load(raw, permitted_classes: [], aliases: false)

  unless data.is_a?(Hash)
    $stderr.puts("error: '#{yaml_path}': root must be a mapping")
    return nil
  end

  title            = data["title"]
  filename         = data["filename"]
  tool_call_params = data["tool_call_params"] || ""
  sections         = data["sections"]
  patches          = data["patches"] || []

  unless title.is_a?(String)
    $stderr.puts("error: '#{yaml_path}': 'title' must be a string")
    return nil
  end

  unless filename.is_a?(String)
    $stderr.puts("error: '#{yaml_path}': 'filename' must be a string")
    return nil
  end

  unless tool_call_params.is_a?(String)
    $strerr.puts("error: '#{yaml_path}': 'tool_call_params' must be a string (HEREDOC)")
    return nil
  end

  unless sections.is_a?(Array) && sections.all? { |s| s.is_a?(String) }
    $stderr.puts("error: '#{yaml_path}': 'sections' must be an array of strings")
    return nil
  end

  unless patches.is_a?(Array) && patches.all? { |p| p.is_a?(String) }
    $stderr.puts("error: '#{yaml_path}': 'patches' must be an array of strings")
    return nil
  end

  config = PromptConfig.new
  config.title = title
  config.filename = filename
  config.tool_call_params = tool_call_params.strip
  config.sections = sections
  config.patches = patches
  return config
rescue Psych::Exception => e
  $stderr.puts("error: '#{yaml_path}': YAML parse error: #{e.message}")
  return nil
end

# Wraps assembled section content in the standard system prompt scaffolding.
#
# @param [PromptConfig] config
# @param [String] content the assembled, ordered section content to embed
# @return [String] the complete scaffolded prompt string
def scaffolding(config, content)
  # the header is consumed by the prompt switcher extension and is not part of the LLM message
  header = String.new("")

  # ensure a trailing newline so the closing tag always starts on its own line
  body = content.end_with?("\n") ? content : "#{content}\n"

  if config.tool_call_params.length > 0
    header << <<~MD
      ---
      #{config.tool_call_params}
      ---

    MD
  end

  return "#{header}<system_prompt strict allow-reveal allow-explain>\n#{body}</system_prompt>\n"
end

# Reads and concatenates section files in order using POSIX cat semantics.
# No newlines are inserted between sections; each file's raw content is used verbatim.
#
# @param [Array<String>] section_ids ordered section filenames, each resolved relative to base_dir
# @param [String] base_dir directory against which section filenames are resolved
# @return [String, nil] the raw concatenated content, or nil if any section file cannot be read
def read_sections(section_ids, base_dir)
  # @type [Array<String>]
  buffers = []

  section_ids.each do |section_id|
    if section_id == "builtin:newline"
      buffers << "\n"
    else
      content = read_file(File.join(base_dir, section_id))
      return if content.nil?
      buffers << content
    end
  end

  return buffers.join
end

# Writes a string to disk, creating any missing parent directories.
#
# @param [String] content string to write
# @param [String] path destination file path
# @return [Boolean] true on success, false on any write error
def write_output(content, path)
  $stdout.puts("writing prompt to: '#{path}'")
  FileUtils.mkdir_p(File.dirname(path))
  File.write(path, content)
  return true
rescue SystemCallError => e
  $stderr.puts("error: cannot write '#{path}': #{e.message}")
  return false
end

# Applies a sequence of patch files to the build output using the system patch(1) utility.
# Stops and returns false on the first patch that does not apply cleanly.
#
# @param [Array<String>] patches ordered patch filenames resolved relative to yaml_dir
# @param [String] yaml_dir directory against which patch filenames are resolved
# @param [String] output_path path to the file to be patched
# @return [Boolean] true if all patches applied cleanly, false on the first failure
def apply_patches(patches, yaml_dir, output_path)
  patches.each do |patch_name|
    patch_path = File.join(yaml_dir, patch_name)
    _out, err, status = Open3.capture3("patch", "--no-backup-if-mismatch", "-i", patch_path, output_path)
    unless status.success?
      $stderr.puts("error: patch '#{patch_path}' failed:\n#{err.strip}")
      return false
    end
  end
  return true
rescue SystemCallError => e
  $stderr.puts("error: cannot run patch(1): #{e.message}")
  return false
end

# Executes the full build pipeline for a single YAML prompt configuration:
# reads sections, applies scaffolding, writes the output file, then applies patches.
#
# @param [String] yaml_path path to the YAML configuration file
# @param [String] output_dir root directory for all build output files
# @return [BuildStatus] the build status
def build(yaml_path, output_dir)
  config = parse_config(yaml_path)
  return BuildStatus::YamlParseError if config.nil?

  yaml_dir = File.dirname(File.expand_path(yaml_path))
  content = read_sections(config.sections, yaml_dir)
  return BuildStatus::SectionReadError if content.nil?

  output = scaffolding(config, content)
  output_path = File.join(output_dir, config.filename)

  return BuildStatus::WriteError unless write_output(output, output_path)
  return BuildStatus::PatchError unless apply_patches(config.patches, yaml_dir, output_path)

  return BuildStatus::Success
end

# Builds all prompts from the given YAML files, printing a result line per file.
#
# @param [String] output_dir root directory for all build output
# @param [Array<String>] yaml_paths list of YAML configuration file paths to process
# @return [Boolean] true if every build succeeded, false if any failed
def main(output_dir, yaml_paths)
  all_ok = true

  yaml_paths.each do |yaml_path|
    status = build(yaml_path, output_dir)
    if status == BuildStatus::Success
      $stdout.puts("ok: #{yaml_path}")
    else
      $stderr.puts("failed: #{yaml_path}")
      all_ok = false
    end
  end

  return all_ok
end

if ARGV.length < 2
  $stderr.puts(USAGE)
  exit(1)
end

exit(main(ARGV[0], ARGV.drop(1)) ? 0 : 1)
