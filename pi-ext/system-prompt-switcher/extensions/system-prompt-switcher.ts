import { lstat, readdir, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve, sep } from "node:path";
import { Container, Spacer, Text, Editor, SelectList, Key, matchesKey } from "@earendil-works/pi-tui";
import { DynamicBorder } from "@earendil-works/pi-coding-agent";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import type { AutocompleteItem } from "@earendil-works/pi-tui";

const SYSTEM_PROMPT_DIR: string = resolve(join(homedir(), ".pi", "agent", "systems"));
const SYSTEM_PROMPT_EXT: string = ".md";

// per-process current prompt
let g_current_prompt: string = "default";

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
        return {
            ok: true,
            name: g_current_prompt,
            path: path,
            content: await readFile(path, "utf8"),
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

export default async function system_prompt_switcher_extension(pi: ExtensionAPI): Promise<void> {
    // cache prompt list on extension start
    let prompts = await discover_system_prompts();
    let active_prompt = await load_selected_prompt();

    pi.on("session_start", (_event, ctx) => {
        if (!ctx.hasUI || !active_prompt.ok) {
            return;
        }

        ctx.ui.setStatus("system-prompt", `[system prompt: ${active_prompt.name}]`);
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

        ctx.ui.setStatus("system-prompt", `[system prompt: ${result.name}]`);
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
