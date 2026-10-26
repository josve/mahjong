// Integration with Autotable (https://github.com/josve/autotable), where the
// match can be played online.
//
// AUTOTABLE_API_URL: Base URL of the Autotable server, used to create games (e.g. http://127.0.0.1:1235)
// AUTOTABLE_API_KEY: Optional key, must match AUTOTABLE_API_KEY on the Autotable server
// AUTOTABLE_URL:     Public URL of the Autotable frontend (e.g. https://example.com/autotable/)

/**
 * Creates a new game on the Autotable server and returns its id, or null if
 * Autotable isn't configured or the game couldn't be created.
 */
export async function createAutotableGame(): Promise<string | null> {
  const apiUrl = process.env.AUTOTABLE_API_URL;
  if (!apiUrl) {
    return null;
  }

  try {
    const headers: Record<string, string> = {};
    if (process.env.AUTOTABLE_API_KEY) {
      headers["Authorization"] = `Bearer ${process.env.AUTOTABLE_API_KEY}`;
    }
    const response = await fetch(`${apiUrl.replace(/\/+$/, "")}/games`, {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      console.error(`[autotable] Failed to create game: HTTP ${response.status}`);
      return null;
    }
    const { gameId } = await response.json();
    return typeof gameId === "string" ? gameId : null;
  } catch (error) {
    console.error("[autotable] Failed to create game:", error);
    return null;
  }
}

/** Returns the link for joining the Autotable game, or null if Autotable isn't configured. */
export function getAutotableGameUrl(autotableGameId: string | null | undefined): string | null {
  const url = process.env.AUTOTABLE_URL;
  if (!url || !autotableGameId) {
    return null;
  }
  return `${url}?gameId=${encodeURIComponent(autotableGameId)}`;
}
