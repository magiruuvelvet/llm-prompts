import { lstat, readdir, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve, sep } from "node:path";
import { Container, Spacer, Text, Editor, SelectList, Key, matchesKey } from "@earendil-works/pi-tui";
import { DynamicBorder, isToolCallEventType } from "@earendil-works/pi-coding-agent";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import type { AutocompleteItem } from "@earendil-works/pi-tui";

const SYSTEM_PROMPT_DIR: string = resolve(join(homedir(), ".pi", "agent", "systems"));
const SYSTEM_PROMPT_EXT: string = ".md";

type tool_call_params = Record<string, Record<string, string>>;

// per-process current prompt
let g_current_prompt: string = "default";

// parsed tool params from the active prompt's front matter
// layout: tool_name -> { param_name -> value }
let g_current_params: tool_call_params = {};

class tool_call_config {
    // tool_name -> { param_name -> value }
    params: tool_call_params;
    // prompt content with the front matter block stripped
    content: string;

    constructor() {
        this.params = {};
        this.content = "";
    }
}

function parse_tool_call_config(raw: string): tool_call_config {
    const result = new tool_call_config();

    // front matter must start at the very beginning of the file
    if (!raw.startsWith("---")) {
        result.content = raw;
        return result;
    }

    // find the closing fence; it must be on its own line
    const close = raw.indexOf("\n---", 3);
    if (close === -1) {
        result.content = raw;
        return result;
    }

    const block = raw.slice(3, close); // text between the two fences
    result.content = raw.slice(close + 4).trimStart(); // everything after the closing fence

    for (const line of block.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed) {
            continue;
        }

        // require ": " as separator so bare colons in values don't break things
        const colon = trimmed.indexOf(": ");
        if (colon === -1) {
            continue;
        }

        const key   = trimmed.slice(0, colon).trim();
        const value = trimmed.slice(colon + 2).trim();

        const dot = key.indexOf('.');
        if (dot === -1) {
            continue;
        }

        const tool_name  = key.slice(0, dot);
        const param_name = key.slice(dot + 1);

        if (!tool_name || !param_name) {
            continue;
        }

        if (!result.params[tool_name]) {
            result.params[tool_name] = {};
        }

        // allow empty values in parameters
        result.params[tool_name][param_name] = value.trim();
    }

    return result;
}

function prompt_path(name: string): string | null {
    if (!name) {
        return null;
    }

    const candidate = resolve(SYSTEM_PROMPT_DIR, `${name}.md`);

    if (candidate.startsWith(`${SYSTEM_PROMPT_DIR}${sep}`)) {
        return candidate;
    } else {
        return null;
    }
}

async function discover_system_prompts(): Promise<string[]> {
    try {
        const entries = await readdir(SYSTEM_PROMPT_DIR, { withFileTypes: true, recursive: true });
        const base_prefix = `${SYSTEM_PROMPT_DIR}${sep}`;
        return entries
            .filter((entry) => entry.isFile() && !entry.name.startsWith(".") && entry.name.endsWith(SYSTEM_PROMPT_EXT))
            .map((entry) => join(entry.parentPath, entry.name).slice(base_prefix.length, -SYSTEM_PROMPT_EXT.length))
            .sort((left, right) => {
                const left_is_root = !left.includes(sep);
                const right_is_root = !right.includes(sep);
                if (left_is_root !== right_is_root) {
                    return left_is_root ? -1 : 1;
                }
                return left.localeCompare(right);
            });
    } catch (error) {
        if (error && typeof error === "object" && "code" in error) {
            const code = String(error.code);
            if (code === "ENOENT" || code === "ENOTDIR") {
                return [];
            }
        }
        throw error;
    }
}

async function select_system_prompt(name: string) {
    const path = prompt_path(name);

    if (!path) {
        return { ok: false, error: `Invalid system prompt name: ${name}` };
    }

    try {
        const info = await lstat(path);
        if (!info.isFile()) {
            return {
                ok: false,
                error: `System prompt not found: ${name}`,
            };
        }
    } catch (error) {
        if (error && typeof error === "object" && "code" in error) {
            const code = String(error.code);
            if (code === "ENOENT" || code === "ENOTDIR") {
                return {
                    ok: false,
                    error: `System prompt not found: ${name}`,
                };
            }
        }
        const message = error instanceof Error ? error.message : String(error);
        return {
            ok: false,
            error: `Could not inspect system prompt ${name}: ${message}`,
        };
    }

    g_current_prompt = name;

    return { ok: true, name, path };
}

async function load_selected_prompt() {
    const path = prompt_path(g_current_prompt);

    if (!path) {
        return {
            ok: false,
            error: `Invalid system prompt name: ${g_current_prompt}`,
        };
    }

    try {
        const info = await lstat(path);
        if (!info.isFile()) {
            return {
                ok: false,
                error: `System prompt not found: ${g_current_prompt}`,
            };
        }

        const raw = await readFile(path, "utf8");
        const fm = parse_tool_call_config(raw);

        // publish the params so the tool_call hook can use them
        g_current_params = fm.params;

        return {
            ok: true,
            name: g_current_prompt,
            path: path,
            content: fm.content,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            ok: false,
            error: `Could not read selected system prompt ${g_current_prompt}: ${message}`,
        };
    }
}

class custom_select_list extends SelectList {
    public override setFilter(filter: string) {
        this.filteredItems = this.items.filter((item) => item.value.toLowerCase().includes(filter.toLowerCase()));
        this.selectedIndex = 0;
    }
}

class filterable_prompt_picker extends Container {
    private readonly filter_input;
    private readonly select_list;
    private current_item;

    constructor(items, tui, theme, on_select: (value: string) => void, on_cancel: () => void) {
        super();

        this.filter_input = new Editor(tui, {
            borderColor: (s) => theme.fg("accent", s),
            selectList: {
                selectedPrefix: (t) => theme.fg("accent", t),
                selectedText: (t) => theme.fg("accent", t),
                description: (t) => theme.fg("muted", t),
                scrollInfo: (t) => theme.fg("dim", t),
                noMatch: (t) => theme.fg("warning", t),
            },
        });
        this.filter_input.onChange = (value: string) => {
            this.select_list.setFilter(value);
        };

        this.addChild(this.filter_input);
        this.addChild(new Spacer(1));
        this.addChild(new Text(theme.fg("accent", theme.bold("System Prompts")), 2, 0));
        this.addChild(new Spacer(1));

        this.current_item = items[0];
        this.select_list = new custom_select_list(items, 1000, {
            selectedPrefix: (text) => theme.fg("accent", text),
            selectedText: (text) => theme.fg("accent", text),
            description: (text) => theme.fg("muted", text),
            scrollInfo: (text) => theme.fg("dim", text),
            noMatch: (text) => theme.fg("warning", text),
        });
        this.select_list.onSelect = (item) => {
            // UPSTREAM BUG?: item points to the very first item (before filter) in the list???
            const ritem = this.select_list.filteredItems[this.select_list.selectedIndex];
            ritem && on_select(ritem.value);
        };
        this.select_list.onCancel = on_cancel;
        this.select_list.onSelectionChange = (item) => {
            this.current_item = item;
        };
        this.addChild(this.select_list);

        this.addChild(new Spacer(1));
        this.addChild(new Text(theme.fg("dim", "type to filter • ↑↓ navigate • enter select • esc cancel"), 2, 0));
        this.addChild(new Spacer(1));
        this.addChild(new DynamicBorder((s) => theme.fg("border", s)));
    }

    public override handleInput(data: string): void {
        if (matchesKey(data, Key.escape)) {
            this.select_list.onCancel?.();
            return;
        }

        if (matchesKey(data, Key.enter)) {
            if (this.current_item) {
                this.select_list.onSelect?.(this.current_item);
            }
            return;
        }

        if (matchesKey(data, Key.up) || matchesKey(data, Key.down)) {
            this.select_list.handleInput(data);
            return;
        }

        this.filter_input.handleInput(data);
    }
}

function status_display(): string {
    const tool_params = Object.keys(g_current_params).map((tool) =>
        Object.keys(g_current_params[tool]).map((param) => `${tool}.${param}=${g_current_params[tool][param]}`)
    ).flat().join(", ");

    return `[system prompt: ${g_current_prompt}${tool_params ? `; ${tool_params}` : ""}]`;
}

export default async function system_prompt_switcher_extension(pi: ExtensionAPI): Promise<void> {
    // cache prompt list on extension start
    let prompts = await discover_system_prompts();
    let active_prompt = await load_selected_prompt();

    pi.on("session_start", (_event, ctx) => {
        if (!ctx.hasUI || !active_prompt.ok) {
            return;
        }

        ctx.ui.setStatus("system-prompt", status_display());
    });

    pi.on("before_agent_start", async(_event, ctx) => {
        if (!active_prompt.ok) {
            ctx.ui.notify(active_prompt.error, "warning");
            return undefined;
        }

        return {
            systemPrompt: active_prompt.content.trimEnd(),
        };
    });

    pi.on("tool_call", async(event, ctx) => {
        for (const tool_name in g_current_params) {
            if (!isToolCallEventType(tool_name, event)) {
                continue;
            }

            const overrides = g_current_params[tool_name];
            for (const param_name in overrides) {
                event.input[param_name] = overrides[param_name];
            }
        }
    });

    const handler = async(args, ctx) => {
        // re-discover all system prompts
        prompts = await discover_system_prompts();

        if (prompts.length === 0) {
            ctx.ui.notify(`No system prompts found.`, "warning");
            return;
        }

        // determine if the choice TUI should be shown
        let name = args.trim();
        if (!name) {
            if (!ctx.hasUI) {
                ctx.ui.notify(`Pass one of: ${prompts.join(", ")}`, "warning");
                return;
            }

            const items = prompts.map((prompt) => ({
                value: prompt,
                label: prompt,
            }));

            const choice = await ctx.ui.custom<string | null>((tui, theme, _kb, done) => {
                const picker = new filterable_prompt_picker(
                    items,
                    tui,
                    theme,
                    (value) => done(value),
                    () => done(null),
                );

                return {
                    render(width: number) {
                        return picker.render(width);
                    },
                    invalidate() {
                        picker.invalidate();
                    },
                    handleInput(data: string) {
                        picker.handleInput(data);
                        tui.requestRender();
                    },
                };
            });

            if (!choice) {
                return;
            }

            name = choice;
        }

        const result = await select_system_prompt(name);
        if (!result.ok) {
            ctx.ui.notify(result.error, "error");
            return;
        }

        // set the active system prompt
        active_prompt = await load_selected_prompt();

        ctx.ui.setStatus("system-prompt", status_display());
    };

    pi.registerCommand("system-prompt", {
        description: "Switch the active system prompt from your collection",
        handler: async(args, ctx) => await handler(args, ctx),
        getArgumentCompletions: (prefix: string): AutocompleteItem[] | null => {
            return prompts.filter((i) => i.startsWith(prefix)).map((i) => ({
                value: i,
                label: i,
            })) || null;
        },
    });
}
