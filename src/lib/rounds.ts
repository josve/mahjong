import {Hand} from "@/types/db";

const STARTING_SCORE = 500;

export interface Round {
    hands: Hand[];
    previousHand?: Hand[];
    maxHand: number;
    maxScore: number;
    eastStreaks?: { [teamId: string]: number };
    /** Consecutive rounds each team has won, including this one. */
    winStreaks?: { [teamId: string]: number };
    /** Consecutive rounds each team has scored above zero, including this one. */
    positiveStreaks?: { [teamId: string]: number };
    /** Each team's total score before this round was played. */
    previousTotals?: { [teamId: string]: number };
    /** Each team's total score after this round was played. */
    totals?: { [teamId: string]: number };
}

const sortByTeamId = (a: Hand, b: Hand) => {
    if (a.TEAM_ID < b.TEAM_ID) return -1;
    if (a.TEAM_ID > b.TEAM_ID) return 1;
    return 0;
};

/**
 * Splits a match's hands into played rounds in chronological order.
 * The first four hands are the starting positions and are not a round of their own,
 * but they count towards the running totals.
 */
export function buildRounds(hands: readonly Hand[]): Round[] {
    const handsToProcess = hands.slice(4);

    let maxHand = 0;
    let maxScore = 0;
    for (const hand of handsToProcess) {
        maxHand = Math.max(maxHand, hand.HAND);
        maxScore = Math.max(maxScore, hand.HAND_SCORE);
    }

    const result: Round[] = [];
    let prevHand: Hand[] | undefined = undefined;
    const teamEastStreak: { [teamId: string]: number } = {};
    const teamWinStreak: { [teamId: string]: number } = {};
    const teamPositiveStreak: { [teamId: string]: number } = {};
    const teamTotals: { [teamId: string]: number } = {};
    for (const hand of hands.slice(0, 4)) {
        teamTotals[hand.TEAM_ID] = (teamTotals[hand.TEAM_ID] ?? STARTING_SCORE) + hand.HAND_SCORE;
    }

    for (let i = 0; i < handsToProcess.length; i += 4) {
        const sortedRound = [...handsToProcess.slice(i, i + 4)].sort(sortByTeamId);

        for (const hand of sortedRound) {
            teamEastStreak[hand.TEAM_ID] = hand.WIND === 'E' ? (teamEastStreak[hand.TEAM_ID] || 0) + 1 : 0;
            teamWinStreak[hand.TEAM_ID] = hand.IS_WINNER ? (teamWinStreak[hand.TEAM_ID] || 0) + 1 : 0;
            teamPositiveStreak[hand.TEAM_ID] = hand.HAND_SCORE > 0 ? (teamPositiveStreak[hand.TEAM_ID] || 0) + 1 : 0;
        }

        const previousTotals = {...teamTotals};
        for (const hand of sortedRound) {
            teamTotals[hand.TEAM_ID] = (teamTotals[hand.TEAM_ID] ?? STARTING_SCORE) + hand.HAND_SCORE;
        }

        result.push({
            hands: sortedRound,
            previousHand: prevHand,
            maxScore,
            maxHand,
            eastStreaks: {...teamEastStreak},
            winStreaks: {...teamWinStreak},
            positiveStreaks: {...teamPositiveStreak},
            previousTotals,
            totals: {...teamTotals},
        });

        prevHand = sortedRound;
    }

    return result;
}
