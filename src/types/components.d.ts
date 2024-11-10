import {Hand} from "@/types/db";

export interface HandWithScore extends Hand {
    SCORE?: number;
}

export interface IdToNumber {
    [id: string]: number;
}

export interface IdToNumbers {
    [id: string]: number[];
}

export type PlayerNameToColor = (playerName: string) => string | undefined;

export interface HighRollerInfo {
    [key: string]: [number, number, number, boolean][]
}
