import {Hand} from "@/types/db";

export interface HandWithScore extends Hand {
    SCORE?: number;
}

export interface IdToNumber {
    [id: string]: number;
}

export type PlayerNameToColor = (playerName: string) => string | undefined;

export type PeriodType = "all" | "new" | "year";