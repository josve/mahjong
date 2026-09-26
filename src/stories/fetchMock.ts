// Minimal fetch mock for stories. Components call the Next.js API routes with fetch();
// stories describe the responses with the `fetchMocks` parameter, e.g.
//
//   parameters: { fetchMocks: [{ url: "/api/teams", response: teamsResponse }] }
//
// Unmatched requests fall through to the real fetch.

export interface FetchMockRequest {
    url: URL;
    method: string;
    body: unknown;
}

type Json = object | string | number | boolean | null;

export interface FetchMock {
    /** Matched against the request path (and query). A string must match the start of the path. */
    url: string | RegExp;
    method?: string;
    status?: number;
    /** JSON body, or a function computing it from the request. */
    response?: Json | ((request: FetchMockRequest) => unknown);
    /** Delay in ms before responding. Use Infinity to never respond. */
    delay?: number;
}

function matches(mock: FetchMock, url: URL, method: string) {
    if (mock.method && mock.method.toUpperCase() !== method) {
        return false;
    }
    const path = url.pathname + url.search;
    return typeof mock.url === "string" ? path.startsWith(mock.url) : mock.url.test(path);
}

export function installFetchMocks(mocks: FetchMock[]): () => void {
    const originalFetch = globalThis.fetch;

    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const request = new Request(input, init);
        const url = new URL(request.url, window.location.href);
        const method = request.method.toUpperCase();
        const mock = mocks.find((m) => matches(m, url, method));
        if (!mock) {
            return originalFetch(input, init);
        }

        const text = await request.text();
        let body: unknown = text;
        try {
            body = text ? JSON.parse(text) : undefined;
        } catch {
            // keep raw text
        }

        if (mock.delay) {
            await new Promise((resolve) => {
                if (mock.delay !== Infinity) {
                    setTimeout(resolve, mock.delay);
                }
            });
        }

        const payload = typeof mock.response === "function"
            ? mock.response({url, method, body})
            : mock.response;

        return new Response(JSON.stringify(payload ?? {}), {
            status: mock.status ?? 200,
            headers: {"Content-Type": "application/json"},
        });
    };

    return () => {
        globalThis.fetch = originalFetch;
    };
}
