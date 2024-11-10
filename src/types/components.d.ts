import {Hand} from "@/types/db";

export interface HandWithScore extends Hand {
    SCORE?: number;
}