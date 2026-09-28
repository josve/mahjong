import React from "react";
import {ChipProps} from "@mui/material";
import {IdToColorMap, IdToName} from "@/types/db";
import {Round} from "@/lib/rounds";
import {createHandBadgeContext, getHandBadges} from "@/components/match/HandBadges";

const STARTING_SCORE = 500;
export const LIMIT_HAND = 300;

export interface ProposalProps {
    readonly teamIdToName: IdToName;
    /** The round to show. */
    readonly round: Round;
    /** Team colors, the same as in the match chart. Optional so the widgets still render without them. */
    readonly colors?: IdToColorMap;
    /** All played rounds in chronological order, for widgets that show history. */
    readonly rounds?: readonly Round[];
}

export interface BadgeInfo {
    readonly id: string;
    readonly label: string;
    readonly color: ChipProps["color"];
    readonly icon: React.ReactElement;
}

export interface PlayerResult {
    readonly teamId: string;
    readonly name: string;
    readonly wind: string;
    readonly windName: string;
    /** The wind as a Chinese character, as printed on the tiles. */
    readonly windChar: string;
    readonly hand: number;
    readonly handScore: number;
    readonly isWinner: boolean;
    readonly totalBefore: number;
    readonly totalAfter: number;
    /** 1-based placing before and after this round. */
    readonly rankBefore: number;
    readonly rankAfter: number;
    readonly color: string;
    readonly badges: BadgeInfo[];
    /** Total after every round up to and including this one, starting with the starting score. */
    readonly history: number[];
}

const WIND_NAMES: { [wind: string]: string } = {E: "Öst", S: "Syd", W: "Väst", N: "Norr"};
const WIND_CHARS: { [wind: string]: string } = {E: "東", S: "南", W: "西", N: "北"};
export const WIND_ORDER = ["E", "S", "W", "N"];

const FALLBACK_COLORS = ["#e54646", "#3478c8", "#3caa5a", "#e6a028"];

function toCss(colors: IdToColorMap | undefined, teamId: string, fallbackIndex: number): string {
    const color = colors?.[teamId];
    if (!color) {
        return FALLBACK_COLORS[fallbackIndex % FALLBACK_COLORS.length];
    }
    return `rgb(${Math.round(color.color_red)}, ${Math.round(color.color_green)}, ${Math.round(color.color_blue)})`;
}

function ranks(totals: { [teamId: string]: number }): { [teamId: string]: number } {
    const values = Object.values(totals);
    return Object.fromEntries(
        Object.entries(totals).map(([teamId, total]) => [teamId, 1 + values.filter(v => v > total).length])
    );
}

/** Everything the proposal widgets need about each team's result in a round. */
export function getPlayerResults({teamIdToName, round, colors, rounds}: ProposalProps): PlayerResult[] {
    const before = round.previousTotals ?? {};
    const after = round.totals ?? {};
    const rankBefore = ranks(before);
    const rankAfter = ranks(after);
    const roundIndex = rounds ? rounds.indexOf(round) : -1;

    return round.hands.map((hand, index) => {
        const context = createHandBadgeContext(hand, round);
        const history = [STARTING_SCORE];
        if (rounds && roundIndex >= 0) {
            for (const r of rounds.slice(0, roundIndex + 1)) {
                history.push(r.totals?.[hand.TEAM_ID] ?? history[history.length - 1]);
            }
        }
        return {
            teamId: hand.TEAM_ID,
            name: teamIdToName[hand.TEAM_ID] ?? hand.TEAM_ID,
            wind: hand.WIND,
            windName: WIND_NAMES[hand.WIND] ?? hand.WIND,
            windChar: WIND_CHARS[hand.WIND] ?? hand.WIND,
            hand: hand.HAND,
            handScore: hand.HAND_SCORE,
            isWinner: !!hand.IS_WINNER,
            totalBefore: before[hand.TEAM_ID] ?? STARTING_SCORE,
            totalAfter: after[hand.TEAM_ID] ?? STARTING_SCORE + hand.HAND_SCORE,
            rankBefore: rankBefore[hand.TEAM_ID] ?? 1,
            rankAfter: rankAfter[hand.TEAM_ID] ?? 1,
            color: toCss(colors, hand.TEAM_ID, index),
            badges: getHandBadges(hand, round).map(badge => ({
                id: badge.id,
                label: typeof badge.label === "function" ? badge.label(context) : badge.label,
                color: badge.color,
                icon: badge.icon,
            })),
            history,
        };
    });
}

export const byRank = (a: PlayerResult, b: PlayerResult) => a.rankAfter - b.rankAfter || b.totalAfter - a.totalAfter;
export const byWind = (a: PlayerResult, b: PlayerResult) => WIND_ORDER.indexOf(a.wind) - WIND_ORDER.indexOf(b.wind);

export const signed = (value: number) => (value > 0 ? `+${value}` : `${value}`);

export const SCORE_GREEN = "#2e7d32";
export const SCORE_RED = "#c62828";
export const scoreColor = (value: number) => (value > 0 ? SCORE_GREEN : value < 0 ? SCORE_RED : "text.secondary");
