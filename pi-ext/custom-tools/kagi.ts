import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { readFileSync } from "node:fs";

const KAGI_SECRET_FILE = resolve(join(homedir(), ".pi", "agent", "kagi.secret"));

const KAGI_API_TOKEN = readFileSync(KAGI_SECRET_FILE, "utf-8").trim();
const KAGI_API_HEADERS = Object.freeze({
    "Authorization": `Bearer ${KAGI_API_TOKEN}`,
    "Content-Type": "application/json",
});

interface kagi_api_res {
    success: boolean;
    status: number;
    content: string;
}

async function kagi_search_fetch(
    query: string,
    limit: number | null = null,
    lens_id: string | null = null,
    region: string | null = null,
): Promise<kagi_api_res> {
    query = query.trim();

    if (!query) {
        return {
            success: false,
            status: -1,
            content: "(empty query)",
        };
    }

    const body = {
        query: query,
        workflow: "search",
        format: "markdown",
        safe_search: false,
        filters: {
            safe_search: false,
        },
    };

    if (limit) {
        body.limit = limit;
    }

    if (lens_id) {
        body.lens_id = lens_id;
    }

    if (region) {
        body.filters.region = region;
    }

    const response = await fetch("https://kagi.com/api/v1/search", {
        method: "POST",
        headers: KAGI_API_HEADERS,
        body: JSON.stringify(body),
    });

    return {
        success: response.status === 200,
        status: response.status,
        content: await response.text(),
    };
}

async function kagi_extract(urls: string[]): Promise<kagi_api_res> {
    if (urls.length === 0) {
        return {
            success: false,
            status: -1,
            content: "(no urls)",
        };
    }

    const body = {
        format: "markdown",
        pages: urls.map((url) => ({url: url.trim()})),
    };

    const response = await fetch("https://kagi.com/api/v1/extract", {
        method: "POST",
        headers: KAGI_API_HEADERS,
        body: JSON.stringify(body),
    });

    return {
        success: response.status === 200,
        status: response.status,
        content: await response.text(),
    };
}

// function strip_heading_links(input: string): string {
//     return input.replace(/### \[([^\]]+)\]\([^)]+\)/g, "### $1");
// }

function build_ui_error(tool_name: string, res: kagi_api_res): string {
    return `[${tool_name}:error[${res.status}]: ${res.content}]`;
}

function build_llm_error(tool_name: string, res: kagi_api_res): string {
    return `[${tool_name}:error[${res.status}]: unrecoverable internal tool error; stop calling \`${tool_name}\` in this session]`;
}

function build_llm_res(tool_name: string, res: kagi_api_res, params: string = ""): string {
    return `<${tool_name}:results${params}>\n${res.content.trim()}\n</${tool_name}:results>\n`;
}

export function register_kagi(pi: ExtensionAPI): void {
    pi.registerTool({
        name: "kagi_search_fetch",
        label: "Fetch web results for a query using the Kagi Search API",
        description:
            "Fetch web results for a query using the Kagi Search API. " +
            "Use for general search and when the user explicitly tells you to 'fetch' results/information. " +
            "Results are numbered so that a user may refer to a result by a specific number.",
        parameters: Type.Object({
            // secret parameters: lens_id, region (for tool call interception in Pi)
            query: Type.String({
                description: "A concise, keyword-focused search query. Include essential context for standalone use.",
            }),
            limit: Type.Optional(Type.Number({
                description: "Maximum number of results.",
                default: 10,
                minimum: 1,
                maximum: 30,
            })),
        }),
        prepareArguments(args) {
            return args;
        },
        async execute(_tool_call_id, params, _signal, _on_update, ctx) {
            const query = params.query || "";
            const limit = params.limit || null;
            const lens_id = params.lens_id || null;
            const region = params.region || null;

            //ctx.ui.notify(`[kagi_search_fetch:info: query="${query}", limit="${limit}", lens_id="${lens_id}", region="${region}"]`, "info");

            const res = await kagi_search_fetch(query, limit, lens_id, region);

            if (!res.success) {
                ctx.ui.notify(build_ui_error("kagi_search_fetch", res), "warning");

                return {
                    content: [{type: "text", text: build_llm_error("kagi_search_fetch", res)}],
                    details: {},
                };
            }

            return {
                content: [{type: "text", text: build_llm_res("kagi_search_fetch", res, ` query="${query}"`)}],
                details: {},
            };
        },
    });

    pi.registerTool({
        name: "kagi_extract",
        label: "",
        description:
            "Extract the content of a web page as Markdown using the Kagi Extract API. " +
            "Use this to read the full content of a page when needed.",
        parameters: Type.Object({
            urls: Type.Array(Type.String({
                description: "The HTTPS URLs of the pages to extract content from.",
            })),
        }),
        prepareArguments(args) {
            return args;
        },
        async execute(_tool_call_id, params, _signal, _on_update, ctx) {
            const urls = Array.isArray(params.urls) ? params.urls.filter((url) => !!url) : [];

            //ctx.ui.notify(`[kagi_extract:info: urls=${JSON.stringify(urls)}]`, "info");

            const res = await kagi_extract(urls);

            if (!res.success) {
                ctx.ui.notify(build_ui_error("kagi_extract", res), "warning");

                return {
                    content: [{type: "text", text: build_llm_error("kagi_extract", res)}],
                    details: {},
                };
            }

            return {
                content: [{type: "text", text: build_llm_res("kagi_extract", res)}],
                details: {},
            };
        },
    });
}
