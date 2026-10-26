// Storybook mock of src/lib/autotable.ts, registered with sb.mock() in .storybook/preview.tsx.
import {fn} from "storybook/test";

export const createAutotableGame = fn(async () => "ABCDE").mockName("createAutotableGame");
export const getAutotableGameUrl = fn((autotableGameId: string | null | undefined) =>
    autotableGameId ? `https://example.com/autotable/?gameId=${autotableGameId}` : null
).mockName("getAutotableGameUrl");
