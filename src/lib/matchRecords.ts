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
    readonly longestEastStreak: number | null;
}

export interface MatchStats {
    readonly highestScore: number;
    readonly lowestScore: number;
    readonly biggestWin: number;
    readonly biggestLoss: number;
    readonly rounds: number;
    /** Final score difference between the winning team and the runner-up. */
    readonly finalMargin: number;
    /** The furthest the eventual winner was behind the leader after any round. */
    readonly winnerMaxDeficit: number;
    /** Most consecutive rounds a single team stayed east. */
    readonly longestEastStreak: number;
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
    const ranked = [...finalScores.entries()].sort((a, b) => b[1] - a[1]);
    const winnerId = ranked[0][0];

    const roundNumbers = [...new Set(played.map(hand => hand.ROUND))].sort((a, b) => a - b);
    const runningScores = new Map<string, number>([...finalScores.keys()].map(teamId => [teamId, STARTING_SCORE]));
    const eastStreaks = new Map<string, number>();
    let winnerMaxDeficit = 0;
    let longestEastStreak = 0;
    for (const round of roundNumbers) {
        for (const hand of played.filter(hand => hand.ROUND === round)) {
            runningScores.set(hand.TEAM_ID, runningScores.get(hand.TEAM_ID)! + hand.HAND_SCORE);
            const streak = hand.WIND === 'E' ? (eastStreaks.get(hand.TEAM_ID) ?? 0) + 1 : 0;
            eastStreaks.set(hand.TEAM_ID, streak);
            longestEastStreak = Math.max(longestEastStreak, streak);
        }
        const leader = Math.max(...runningScores.values());
        winnerMaxDeficit = Math.max(winnerMaxDeficit, leader - runningScores.get(winnerId)!);
    }

    return {
        highestScore: Math.max(...scores),
        lowestScore: Math.min(...scores),
        biggestWin: Math.max(...handScores),
        biggestLoss: Math.min(...handScores),
        rounds: roundNumbers.length,
        finalMargin: ranked.length > 1 ? ranked[0][1] - ranked[1][1] : 0,
        winnerMaxDeficit,
        longestEastStreak,
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
        longestEastStreak: extreme(stats.map(s => s.stats.longestEastStreak), Math.max),
    };
}
