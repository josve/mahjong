// Deterministic mock data used by Storybook stories and module mocks.

import type {Session} from "next-auth";
import type {
    GameWithHands,
    Hand,
    IdToColorMap,
    IdToName,
    MatchWithIdx,
    PlayerOrTeam,
    TeamIdToDetails,
    TeamIdToPlayerIds,
    TotalStatistics,
    UpcomingGame,
} from "@/types/db";
import type {MatchChartResponse, StatisticsResponse, TeamsResponse} from "@/types/api";
import {MahjongStats} from "@/lib/statistics";
import type {Round} from "@/components/match/matchChartClient";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export const players: PlayerOrTeam[] = [
    {id: "p1", name: "Anna"},
    {id: "p2", name: "Björn"},
    {id: "p3", name: "Cecilia"},
    {id: "p4", name: "David"},
    {id: "p5", name: "Erik"},
    {id: "p6", name: "Frida"},
];

// Every team has its own id, also when a single player plays alone.
const soloTeams: PlayerOrTeam[] = players.map((p, i) => ({id: `t${i + 1}`, name: p.name}));

export const teams: PlayerOrTeam[] = [
    ...soloTeams,
    {id: "t-ab", name: "Draklaget"},
    {id: "t-cd", name: "Cecilia+David"},
];

export const allTeamsAndPlayers: PlayerOrTeam[] = [...players, ...teams];

export const teamIdToName: IdToName = Object.fromEntries(teams.map((t) => [t.id, t.name]));

export const teamIdToPlayerIds: TeamIdToPlayerIds = {
    ...Object.fromEntries(soloTeams.map((t, i) => [t.id, [players[i].id]])),
    "t-ab": ["p1", "p2"],
    "t-cd": ["p3", "p4"],
};

const rgb: { [id: string]: [number, number, number] } = {
    p1: [229, 70, 70],
    p2: [52, 120, 200],
    p3: [60, 170, 90],
    p4: [230, 160, 40],
    p5: [140, 80, 190],
    p6: [30, 170, 180],
};

export const playerColors: IdToColorMap = Object.fromEntries(
    Object.entries(rgb).map(([id, [r, g, b]]) => [id, {color_red: r, color_green: g, color_blue: b}])
);

export const teamAndPlayerColors: IdToColorMap = {
    ...playerColors,
    ...Object.fromEntries(
        Object.entries(teamIdToPlayerIds)
            .map(([teamId, ids]) => [teamId, {
                color_red: ids.reduce((s, id) => s + rgb[id][0], 0) / ids.length,
                color_green: ids.reduce((s, id) => s + rgb[id][1], 0) / ids.length,
                color_blue: ids.reduce((s, id) => s + rgb[id][2], 0) / ids.length,
            }])
    ),
};

export const teamDetails: TeamIdToDetails = Object.fromEntries(
    Object.entries(teamIdToPlayerIds).map(([teamId, ids]) => {
        const concatenatedName = ids.map((id) => players.find((p) => p.id === id)!.name).sort().join("+");
        return [teamId, {id: teamId, playerIds: ids, teamName: teamIdToName[teamId], concatenatedName}];
    })
);

export const teamsResponse: TeamsResponse[] = Object.values(teamDetails).map((t) => ({
    id: t.id,
    name: t.teamName,
    concatenatedName: t.concatenatedName,
    playerIds: t.playerIds,
}));

// Small seeded PRNG so the generated games look the same on every render.
function createRandom(seed: number) {
    let state = seed;
    return () => {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
}

const WINDS = ["E", "S", "W", "N"];
const HAND_VALUES = [0, 2, 4, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 96];

interface GameOptions {
    gameId: string;
    name: string;
    comment?: string;
    teamIds: [string, string, string, string];
    start: Date;
    numRounds: number;
    seed: number;
    limitHandInRound?: number;
}

export function createGame({gameId, name, comment = "", teamIds, start, numRounds, seed, limitHandInRound}: GameOptions): GameWithHands {
    const random = createRandom(seed);
    const hands: Hand[] = [];
    let eastIndex = 0;

    const windFor = (seat: number) => WINDS[(seat - eastIndex + 4) % 4];

    teamIds.forEach((teamId, seat) => {
        hands.push({
            ROUND: 0, GAME_ID: gameId, TIME: new Date(start), HAND: 0, IS_WINNER: false,
            WIND: windFor(seat), TEAM_ID: teamId, HAND_SCORE: 0, IS_TEST: false,
        });
    });

    for (let round = 1; round <= numRounds; round++) {
        const time = new Date(start.getTime() + round * 8 * 60 * 1000);
        const winnerSeat = random() < 0.1 ? -1 : Math.floor(random() * 4);
        const handValues = teamIds.map((_, seat) => {
            if (round === limitHandInRound && seat === winnerSeat) {
                return 300;
            }
            const value = HAND_VALUES[Math.floor(random() * HAND_VALUES.length)];
            return seat === winnerSeat ? Math.max(value, 20) + 20 : value;
        });

        // Winner collects its hand from everybody, the others settle the difference.
        // Payments to or from east are doubled.
        const scores = [0, 0, 0, 0];
        for (let a = 0; a < 4; a++) {
            for (let b = a + 1; b < 4; b++) {
                const multiplier = a === eastIndex || b === eastIndex ? 2 : 1;
                let amount: number;
                if (a === winnerSeat) {
                    amount = handValues[a];
                } else if (b === winnerSeat) {
                    amount = -handValues[b];
                } else {
                    amount = handValues[a] - handValues[b];
                }
                scores[a] += amount * multiplier;
                scores[b] -= amount * multiplier;
            }
        }

        teamIds.forEach((teamId, seat) => {
            hands.push({
                ROUND: round, GAME_ID: gameId, TIME: time, HAND: handValues[seat],
                IS_WINNER: seat === winnerSeat, WIND: windFor(seat), TEAM_ID: teamId,
                HAND_SCORE: scores[seat], IS_TEST: false,
            });
        });

        if (winnerSeat !== eastIndex) {
            eastIndex = (eastIndex + 1) % 4;
        }
    }

    return {
        GAME_ID: gameId, TIME: new Date(start), NAME: name, COMMENT: comment,
        TEAM_ID_1: teamIds[0], TEAM_ID_2: teamIds[1], TEAM_ID_3: teamIds[2], TEAM_ID_4: teamIds[3],
        IS_TEST: false, hands,
    };
}

const now = Date.now();

export const activeMatch = createGame({
    gameId: "game-active",
    name: "Fredagsmahjong",
    comment: "Hemma hos Anna",
    teamIds: ["t1", "t2", "t3", "t4"],
    start: new Date(now - 2 * HOUR),
    numRounds: 12,
    seed: 42,
});

export const limitHandMatch = createGame({
    gameId: "game-limit",
    name: "Nyårsturneringen",
    comment: "Björn fick limit hand!",
    teamIds: ["t2", "t5", "t6", "t-cd"],
    start: new Date(now - 30 * DAY),
    numRounds: 16,
    seed: 7,
    limitHandInRound: 9,
});

export const oldMatch = createGame({
    gameId: "game-old",
    name: "Sommarmatch",
    teamIds: ["t-ab", "t3", "t5", "t6"],
    start: new Date(now - 90 * DAY),
    numRounds: 10,
    seed: 1337,
});

export const matches: GameWithHands[] = [
    activeMatch,
    limitHandMatch,
    oldMatch,
    ...Array.from({length: 9}, (_, i) => createGame({
        gameId: `game-${i}`,
        name: `Match ${i + 1}`,
        teamIds: [
            ["t1", "t2", "t3", "t4"],
            ["t1", "t3", "t5", "t6"],
            ["t-ab", "t4", "t5", "t6"],
            ["t2", "t-cd", "t5", "t6"],
        ][i % 4] as [string, string, string, string],
        start: new Date(now - (120 + i * 25) * DAY),
        numRounds: 8 + (i * 3) % 9,
        seed: 100 + i,
    })),
];

/** Matches ordered newest first, as returned by fetchMatches(true). */
export const matchesDesc = [...matches].sort((a, b) => b.TIME.getTime() - a.TIME.getTime());
/** Matches ordered oldest first, as returned by fetchMatches(). */
export const matchesAsc = [...matchesDesc].reverse();

export function toMatchWithIdx(game: GameWithHands): MatchWithIdx {
    const {hands, ...match} = game;
    return {...match, GAME_IDX: matchesAsc.findIndex((m) => m.GAME_ID === game.GAME_ID)};
}

export function matchChartResponse(game: GameWithHands): MatchChartResponse {
    const ids = [game.TEAM_ID_1, game.TEAM_ID_2, game.TEAM_ID_3, game.TEAM_ID_4];
    return {
        hands: game.hands,
        teamIdToName: Object.fromEntries(ids.map((id) => [id, teamIdToName[id]])),
        teamColors: Object.fromEntries(ids.map((id) => [id, teamAndPlayerColors[id]])),
        match: toMatchWithIdx(game),
    };
}

export function relevantTeams(game: GameWithHands): IdToName {
    return Object.fromEntries(
        [game.TEAM_ID_1, game.TEAM_ID_2, game.TEAM_ID_3, game.TEAM_ID_4].map((id) => [id, teamIdToName[id]])
    );
}

export function handsForRound(game: GameWithHands, round: number): Hand[] {
    return game.hands.filter((hand) => hand.ROUND === round);
}

/** Builds the Round structure LastRoundDisplay expects, the same way MatchChartClient does. */
export function roundFor(game: GameWithHands, round: number, eastStreak = 0): Round {
    const played = game.hands.filter((hand) => hand.ROUND > 0);
    const byTeam = (a: Hand, b: Hand) => a.TEAM_ID.localeCompare(b.TEAM_ID);
    const hands = handsForRound(game, round).sort(byTeam);
    const east = hands.find((hand) => hand.WIND === "E");
    return {
        hands,
        previousHand: round > 1 ? handsForRound(game, round - 1).sort(byTeam) : undefined,
        maxHand: Math.max(...played.map((hand) => hand.HAND)),
        maxScore: Math.max(...played.map((hand) => hand.HAND_SCORE)),
        eastStreaks: east ? {[east.TEAM_ID]: eastStreak} : {},
    };
}

export const totalStatistics: TotalStatistics = {
    totalMatches: matches.length,
    totalMahjongs: matches.reduce((sum, m) => sum + m.hands.filter((h) => h.IS_WINNER).length, 0),
    totalRounds: matches.reduce((sum, m) => sum + new Set(m.hands.map((h) => h.ROUND)).size, 0),
};

export const statisticsResponse: StatisticsResponse = {
    allTeamsAndPlayers,
    teamIdToName,
    teamIdToPlayerIds,
    teamAndPlayerColors,
    matches: matchesAsc,
};

export function createStats(): MahjongStats {
    const stats = new MahjongStats(allTeamsAndPlayers, teamAndPlayerColors, teamIdToPlayerIds);
    matchesAsc.forEach((match, index) => stats.addGame(match, index));
    stats.finish();
    return stats;
}

export const upcomingGames: UpcomingGame[] = [
    {id: 1, game_time: new Date(now + 3 * DAY), meeting_link: "https://meet.example.com/mahjong", created_at: new Date(now - DAY)},
    {id: 2, game_time: new Date(now + 17 * DAY), meeting_link: null, created_at: new Date(now - DAY)},
    {id: 3, game_time: new Date(now + 31 * DAY), meeting_link: "https://meet.example.com/mahjong-2", created_at: new Date(now)},
];

export const session: Session = {
    expires: new Date(now + 30 * DAY).toISOString(),
    user: {
        SHOW_PREVIOUS_ROUND_SCORE: false,
        PLAYER_ID: "p1",
        NAME: "Anna",
        COLOR_RED: rgb.p1[0],
        COLOR_GREEN: rgb.p1[1],
        COLOR_BLUE: rgb.p1[2],
        IS_TEST: false,
        userColor: `rgb(${rgb.p1.join(",")})`,
        name: "Anna",
        playerId: "p1",
        firstInitial: "A",
        email: "anna@example.com",
    },
};
