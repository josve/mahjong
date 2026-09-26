// Props for the improvement proposals, derived from the regular Storybook fixtures.

import type {GameWithHands} from "@/types/db";
import {activeMatch, limitHandMatch, matchesAsc, matchesDesc, oldMatch, players, teamAndPlayerColors, teamIdToName} from "@/stories/fixtures";
import {ProposalTeam, ProposalTeamScore, STARTING_SCORE} from "@/components/proposals/shared";
import type {MatchCardData} from "@/components/proposals/MatchCardV2";
import type {SearchableMatch} from "@/components/proposals/MatchSearchFilter";
import type {PlayerResult} from "@/components/proposals/PlayerFormCard";

export function team(id: string): ProposalTeam {
    const color = teamAndPlayerColors[id];
    return {
        id,
        name: teamIdToName[id],
        color: `rgb(${Math.round(color.color_red)}, ${Math.round(color.color_green)}, ${Math.round(color.color_blue)})`,
    };
}

function teamIds(game: GameWithHands): string[] {
    return [game.TEAM_ID_1, game.TEAM_ID_2, game.TEAM_ID_3, game.TEAM_ID_4];
}

export function teamsOf(game: GameWithHands): ProposalTeam[] {
    return teamIds(game).map(team);
}

export function numRounds(game: GameWithHands): number {
    return Math.max(...game.hands.map((hand) => hand.ROUND));
}

export function teamScores(game: GameWithHands): ProposalTeamScore[] {
    const rounds = numRounds(game);
    return teamIds(game).map((id) => {
        const history = [STARTING_SCORE];
        for (let round = 1; round <= rounds; round++) {
            const hand = game.hands.find((h) => h.ROUND === round && h.TEAM_ID === id);
            history.push(history[history.length - 1] + (hand?.HAND_SCORE ?? 0));
        }
        return {...team(id), score: history[history.length - 1], history};
    });
}

export function roundDeltas(game: GameWithHands) {
    return Array.from({length: numRounds(game)}, (_, index) => ({
        round: index + 1,
        deltas: Object.fromEntries(game.hands.filter((hand) => hand.ROUND === index + 1).map((hand) => [hand.TEAM_ID, hand.HAND_SCORE])),
    }));
}

const time = (date: Date) => date.toLocaleTimeString("sv-SE", {hour: "2-digit", minute: "2-digit"});
const day = (date: Date) => date.toLocaleDateString("sv-SE", {day: "numeric", month: "long", year: "numeric"});

export function matchCard(game: GameWithHands, extra: Partial<MatchCardData> = {}): MatchCardData {
    const last = game.hands[game.hands.length - 1].TIME;
    return {
        index: matchesAsc.indexOf(game) + 1,
        name: game.NAME,
        date: day(game.TIME),
        timeRange: `${time(game.TIME)}–${time(last)}`,
        rounds: numRounds(game),
        comment: game.COMMENT,
        teams: teamScores(game),
        ...extra,
    };
}

export const activeCard = matchCard(activeMatch, {active: true});
export const limitHandCard = matchCard(limitHandMatch, {badges: ["Limit hand"]});
export const oldCard = matchCard(oldMatch);

export const searchableMatches: SearchableMatch[] = matchesDesc.map((game) => ({
    id: game.GAME_ID,
    index: matchesAsc.indexOf(game) + 1,
    name: game.NAME,
    comment: game.COMMENT,
    time: game.TIME,
    teams: teamScores(game),
}));

export const soloTeams: ProposalTeam[] = players.map((_, index) => team(`t${index + 1}`));
export const allTeams: ProposalTeam[] = [...soloTeams, team("t-ab"), team("t-cd")];

/** Results for Anna (t1) in every match she played, oldest first, padded to ten results. */
export const annaResults: PlayerResult[] = (() => {
    const results = matchesAsc
        .filter((game) => teamIds(game).includes("t1"))
        .map((game) => {
            const sorted = teamScores(game).sort((a, b) => b.score - a.score);
            return {
                matchName: game.NAME,
                date: day(game.TIME),
                placement: sorted.findIndex((score) => score.id === "t1") + 1,
                score: sorted.find((score) => score.id === "t1")!.score,
            };
        });
    const padding: PlayerResult[] = [
        {matchName: "Vårmatch", date: "12 mars", placement: 2, score: 540},
        {matchName: "Påskmahjong", date: "5 april", placement: 4, score: 380},
        {matchName: "Valborg", date: "30 april", placement: 1, score: 710},
        {matchName: "Midsommar", date: "20 juni", placement: 3, score: 470},
        {matchName: "Kräftskiva", date: "22 aug", placement: 1, score: 655},
        {matchName: "Höstmatch", date: "8 sep", placement: 1, score: 602},
    ];
    return [...padding, ...results].slice(-10);
})();

export {activeMatch, limitHandMatch, oldMatch};
