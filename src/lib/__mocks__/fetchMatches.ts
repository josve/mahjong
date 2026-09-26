// Storybook mock of src/lib/fetchMatches.ts, registered with sb.mock() in .storybook/preview.tsx.
import {fn} from "storybook/test";
import {matchesAsc, matchesDesc} from "@/stories/fixtures";
import type {Game, GameWithHands} from "@/types/db";

export const getAllMatches = fn(async (): Promise<Game[]> => matchesDesc).mockName("getAllMatches");

const fetchMatches = fn(async (desc: boolean = false): Promise<GameWithHands[]> =>
    desc ? matchesDesc : matchesAsc
).mockName("fetchMatches");

export default fetchMatches;
