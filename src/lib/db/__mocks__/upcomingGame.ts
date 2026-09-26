// Storybook mock of src/lib/db/upcomingGame.ts, registered with sb.mock() in .storybook/preview.tsx.
import {fn} from "storybook/test";
import {upcomingGames} from "@/stories/fixtures";
import type {UpcomingGame} from "@/types/db";

export const getNextUpcomingGame = fn(async (): Promise<UpcomingGame | null> => upcomingGames[0] ?? null).mockName("getNextUpcomingGame");
export const getAllUpcomingGames = fn(async (): Promise<UpcomingGame[]> => upcomingGames).mockName("getAllUpcomingGames");
export const createUpcomingGame = fn(async (_gameTime: Date, _meetingLink?: string | null) => 99).mockName("createUpcomingGame");
export const updateUpcomingGame = fn(async (_gameId: number, _gameTime: Date, _meetingLink?: string | null) => true).mockName("updateUpcomingGame");
export const deleteUpcomingGame = fn(async (_gameId: number) => true).mockName("deleteUpcomingGame");
