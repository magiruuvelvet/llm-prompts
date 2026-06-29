import { Container, Spacer, Text, Editor, SelectList, Key, matchesKey } from "@earendil-works/pi-tui";
import { DynamicBorder } from "@earendil-works/pi-coding-agent";

export class custom_select_list extends SelectList {
    public override setFilter(filter: string) {
        this.filteredItems = this.items.filter((item) => item.value.toLowerCase().includes(filter.toLowerCase()));
        this.selectedIndex = 0;
    }
}

export class filterable_prompt_picker extends Container {
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
