import {Game, TeamIdToDetails} from "@/types/db";

const TEAMS_PER_MATCH = 4;
// Letting a player play alone when it is their turn outweighs any team frequency.
const SOLO_TURN_SCORE = 1_000_000;

function teamIdsOf(game: Game): string[] {
    return [game.TEAM_ID_1, game.TEAM_ID_2, game.TEAM_ID_3, game.TEAM_ID_4].filter(Boolean);
}

/**
 * Suggests the four teams for the next match.
 *
 * The players are the ones from the latest match. Those who did not play alone in either
 * of the two latest matches play alone, the rest play in the teams they have played in the
 * most. When the players can't be split up exactly like that, the split that lets the most
 * players who are due play alone, and otherwise uses the most played teams, is chosen.
 *
 * @param gamesNewestFirst all matches, newest first
 * @returns four team ids, or an empty list when no suggestion can be made
 */
export function suggestTeams(gamesNewestFirst: Game[], teamDetails: TeamIdToDetails): string[] {
    const [latest, previous] = gamesNewestFirst;
    if (!latest) {
        return [];
    }

    const players = new Set(teamIdsOf(latest).flatMap((teamId) => teamDetails[teamId]?.playerIds ?? []));

    const playedAloneRecently = new Set(
        [latest, previous]
            .filter(Boolean)
            .flatMap(teamIdsOf)
            .map((teamId) => teamDetails[teamId]?.playerIds ?? [])
            .filter((playerIds) => playerIds.length === 1)
            .map(([playerId]) => playerId)
    );

    const timesPlayed: { [teamId: string]: number } = {};
    for (const teamId of gamesNewestFirst.flatMap(teamIdsOf)) {
        timesPlayed[teamId] = (timesPlayed[teamId] ?? 0) + 1;
    }

    const teamScore = (teamId: string) => {
        const playerIds = teamDetails[teamId].playerIds;
        if (playerIds.length === 1) {
            return playedAloneRecently.has(playerIds[0]) ? 0 : SOLO_TURN_SCORE;
        }
        return timesPlayed[teamId] ?? 0;
    };

    const candidateTeams = Object.values(teamDetails)
        .filter((team) => team.playerIds.every((playerId) => players.has(playerId)))
        .map((team) => team.id);

    let best: { teamIds: string[], score: number } | null = null;

    // Try every way to split the players into four existing teams.
    const search = (remaining: Set<string>, chosen: string[], score: number) => {
        if (remaining.size === 0) {
            if (chosen.length === TEAMS_PER_MATCH && (!best || score > best.score)) {
                best = {teamIds: [...chosen], score};
            }
            return;
        }
        if (chosen.length === TEAMS_PER_MATCH) {
            return;
        }
        const [nextPlayer] = remaining;
        for (const teamId of candidateTeams) {
            const playerIds = teamDetails[teamId].playerIds;
            if (!playerIds.includes(nextPlayer) || !playerIds.every((playerId) => remaining.has(playerId))) {
                continue;
            }
            const rest = new Set(remaining);
            playerIds.forEach((playerId) => rest.delete(playerId));
            chosen.push(teamId);
            search(rest, chosen, score + teamScore(teamId));
            chosen.pop();
        }
    };

    search(players, [], 0);

    return best ? (best as { teamIds: string[] }).teamIds : [];
}
