import {GameWithHands} from "@/types/db";

const STARTING_SCORE = 500;
export const ACTIVE_MATCH_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * All-time records across matches, used to decide which match cards get a record badge.
 * A value is null when no match qualifies for that record.
 */
export interface MatchRecords {
    readonly highestScore: number | null;
    readonly lowestScore: number | null;
    readonly biggestWin: number | null;
    readonly biggestLoss: number | null;
    readonly fewestRounds: number | null;
    readonly mostRounds: number | null;
}

export interface MatchStats {
    readonly highestScore: number;
    readonly lowestScore: number;
    readonly biggestWin: number;
    readonly biggestLoss: number;
    readonly rounds: number;
}

export function isActiveMatch(match: GameWithHands): boolean {
    return Date.now() - new Date(match.TIME).getTime() < ACTIVE_MATCH_WINDOW_MS;
}

/** Per-match stats, or null when no rounds have been played yet. */
export function getMatchStats(match: GameWithHands): MatchStats | null {
    const played = match.hands.filter(hand => hand.ROUND > 0);
    if (played.length === 0) {
        return null;
    }

    const finalScores = new Map<string, number>();
    for (const hand of match.hands) {
        finalScores.set(hand.TEAM_ID, (finalScores.get(hand.TEAM_ID) ?? STARTING_SCORE) + hand.HAND_SCORE);
    }
    const scores = [...finalScores.values()];
    const handScores = played.map(hand => hand.HAND_SCORE);

    return {
        highestScore: Math.max(...scores),
        lowestScore: Math.min(...scores),
        biggestWin: Math.max(...handScores),
        biggestLoss: Math.min(...handScores),
        rounds: new Set(played.map(hand => hand.ROUND)).size,
    };
}

function extreme(values: number[], pick: (...values: number[]) => number): number | null {
    return values.length > 0 ? pick(...values) : null;
}

export function computeMatchRecords(matches: readonly GameWithHands[]): MatchRecords {
    const stats = matches
        .map(match => ({match, stats: getMatchStats(match)}))
        .filter((entry): entry is { match: GameWithHands, stats: MatchStats } => entry.stats !== null);
    // An ongoing match would otherwise almost always be the shortest one.
    const finished = stats.filter(entry => !isActiveMatch(entry.match));

    return {
        highestScore: extreme(stats.map(s => s.stats.highestScore), Math.max),
        lowestScore: extreme(stats.map(s => s.stats.lowestScore), Math.min),
        biggestWin: extreme(stats.map(s => s.stats.biggestWin), Math.max),
        biggestLoss: extreme(stats.map(s => s.stats.biggestLoss), Math.min),
        fewestRounds: extreme(finished.map(s => s.stats.rounds), Math.min),
        mostRounds: extreme(stats.map(s => s.stats.rounds), Math.max),
    };
}
