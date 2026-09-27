import {GameWithHands, Hand, IdToColorMap, PlayerOrTeam, TeamIdToPlayerIds} from "@/types/db";
import {buildRounds} from "@/lib/rounds";
import {createHandBadgeContext, getHandBadges} from "@/components/match/HandBadges";

export interface HighRollerInfo {
    gameIndex: number;
    hand: number;
    highRollerIndex: string;
    isTeam: boolean;
}

export interface ComebackInfo {
    gameIndex: number;
    lowestPosition: number;
    deficit: number;
    comebackIndex: string;
    isTeam: boolean;
}

export interface WindRecord {
    E: number;
    N: number;
    W: number;
    S: number;
    [key: string]: number;
}

function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

export class PlayerData {
    public id: string;
    public name: string;
    public scores: number[] = [];
    public wins: number = 0;
    public sumHands: number = 0;
    public numHands: number = 0;
    public stdDev: number = 0;
    public allHands: number[] = [];
    public allHandsNoTeams: number[] = [];
    public allScores: number[] = [];
    public allScoresNoTeams: number[] = [];
    public highRollers: HighRollerInfo[] = [];
    public comebackGames: ComebackInfo[] = [];
    /** How many times each hand badge was earned, keyed by badge id. */
    public handBadgeCounts: { [badgeId: string]: number } = {};
    /** Longest streak reached for each streak badge, keyed by badge id. */
    public longestBadgeStreaks: { [badgeId: string]: number } = {};
    public windWins: WindRecord = { E: 0, N: 0, W: 0, S: 0 };
    public windHands: WindRecord = { E: 0, N: 0, W: 0, S: 0 };
    public averageHand: number = 0;
    public playerIds: string[];
    public color: string;
    public numGames: number = 0;

    constructor(playerOrTeam: PlayerOrTeam, playerIds: string[], color: string) {
        this.id = playerOrTeam.id;
        this.name = playerOrTeam.name;
        this.playerIds = playerIds;
        this.color = color;
    }

    public isPlayer(): boolean {
        return this.playerIds.length === 0;
    }

    public initGame(_game: GameWithHands) {
        // Initialize scores for this match
        this.scores.push(this.scores.length > 0 ? this.scores[this.scores.length - 1] : 0);
    }

    public addGame(_game: GameWithHands) {
        this.numGames++;
    }

    public addHand(gameIndex: number, hand: Hand, isPartOfTeam: boolean) {
        const scorePerPlayer = isPartOfTeam ? hand.HAND_SCORE / 2 : hand.HAND_SCORE;
        this.scores[this.scores.length - 1] += scorePerPlayer;
        if (hand.IS_WINNER) {
            this.wins++;
        }
        this.sumHands += hand.HAND;
        this.allHands.push(hand.HAND);
        this.allScores.push(hand.HAND_SCORE);
        if (!isPartOfTeam) {
            this.allHandsNoTeams.push(hand.HAND);
            this.allScoresNoTeams.push(hand.HAND_SCORE);
        }
        this.numHands++;
        if (hand.WIND in this.windHands) {
            this.windHands[hand.WIND]++;
            if (hand.IS_WINNER) {
                this.windWins[hand.WIND]++;
            }
        }
        if (hand.HAND > 100) {
            this.highRollers.push({
                gameIndex: gameIndex,
                hand: hand.HAND,
                highRollerIndex: uuidv4(),
                isTeam: isPartOfTeam
            });
        }
    }

    public addComeback(gameIndex: number, lowestPosition: number, deficit: number, isTeam: boolean) {
        this.comebackGames.push({
            gameIndex,
            lowestPosition,
            deficit,
            comebackIndex: uuidv4(),
            isTeam,
        });
    }

    public addHandBadge(badgeId: string, streak?: number) {
        this.handBadgeCounts[badgeId] = (this.handBadgeCounts[badgeId] ?? 0) + 1;
        if (streak !== undefined && streak > (this.longestBadgeStreaks[badgeId] ?? 0)) {
            this.longestBadgeStreaks[badgeId] = streak;
        }
    }

    public finish() {
        this.averageHand = this.numHands > 0 ? this.sumHands / this.numHands : 0;

        const playerScores = this.scores;
        const mean = playerScores.reduce((acc, score) => acc + score, 0) / playerScores.length;
        const squaredDifferences = playerScores.map(score => Math.pow(score - mean, 2));
        const variance = squaredDifferences.reduce((acc, diff) => acc + diff, 0) / squaredDifferences.length;
        this.stdDev = Math.sqrt(variance);
    }
}

export interface IdToPlayerData {
    [id: string]: PlayerData
}

export class MahjongStats {
    public idToPlayerData: IdToPlayerData = {};
    public playerDataList: PlayerData[] = [];
    public labels: string[] = [];

    constructor(allTeamsAndPlayers: PlayerOrTeam[],
                teamAndPlayerColors: IdToColorMap,
                teamIdToPlayerIds: TeamIdToPlayerIds) {
        allTeamsAndPlayers.forEach((playerOrTeam) => {
            const playerIds =
                teamIdToPlayerIds.hasOwnProperty(playerOrTeam.id) ?
                    teamIdToPlayerIds[playerOrTeam.id] :
                    [];
            const color = teamAndPlayerColors[playerOrTeam.id];
            const stringColor = `rgb(${color.color_red}, ${color.color_green}, ${color.color_blue})`;
            const playerData =  new PlayerData(playerOrTeam, playerIds, stringColor);
            this.idToPlayerData[playerOrTeam.id] = playerData;
            this.playerDataList.push(playerData);
        });
    }

    public getDataToShow(showTeams: boolean = false) {
        const result = [];
        for (const playerOrTeam of this.playerDataList) {
            if (playerOrTeam.isPlayer()) {
                result.push(playerOrTeam);
            }

            if (showTeams &&
                playerOrTeam.playerIds.length > 1 &&
                playerOrTeam.numGames > 0) {
                result.push(playerOrTeam);
            }
        }

        const sortedMatches = [...result].sort(
            (a, b) => b.numGames - a.numGames
        );

        return sortedMatches.slice(0, 9);
    }

    private addLabel(game: GameWithHands) {
        const matchDate: Date = new Date(game.TIME);
        const label = `${matchDate.getFullYear()}-${(matchDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${matchDate.getDate().toString().padStart(2, "0")}`;
        this.labels.push(label);
    }

    private getTeamData(game: GameWithHands): PlayerData[] {
        return [this.idToPlayerData[game.TEAM_ID_1],
            this.idToPlayerData[game.TEAM_ID_2],
            this.idToPlayerData[game.TEAM_ID_3],
            this.idToPlayerData[game.TEAM_ID_4]];
    }

    private getPlayerData(teams: PlayerData[]): PlayerData[] {
        const result: PlayerData[] = [];
        for (const team of teams) {
            for (const playerId of team.playerIds) {
                result.push(this.idToPlayerData[playerId]);
            }
        }
        return result;
    }

    public addGame(game: GameWithHands, gameIndex: number) {
        this.addLabel(game);

        const teams = this.getTeamData(game);
        const players = this.getPlayerData(teams);



        this.playerDataList.forEach((player) => { player.initGame(game); });
        teams.forEach((team) => { team.addGame(game); });
        players.forEach((player) => { player.addGame(game); });

        game.hands.forEach((hand: Hand) => {
            const teamData = this.idToPlayerData[hand.TEAM_ID];
            const playerIds = teamData.playerIds!;
            playerIds.forEach((playerId: string) => {
                const playerData = this.idToPlayerData[playerId];
                playerData.addHand(gameIndex, hand, playerIds.length > 1);
            });
            teamData.addHand(gameIndex, hand, false);
        });

        this.processComeback(game, gameIndex);
        this.processHandBadges(game);
    }

    private processHandBadges(game: GameWithHands) {
        for (const round of buildRounds(game.hands)) {
            for (const hand of round.hands) {
                const teamData = this.idToPlayerData[hand.TEAM_ID];
                const context = createHandBadgeContext(hand, round);
                for (const badge of getHandBadges(hand, round)) {
                    const streak = badge.streak?.(context);
                    teamData.addHandBadge(badge.id, streak);
                    for (const playerId of teamData.playerIds) {
                        this.idToPlayerData[playerId].addHandBadge(badge.id, streak);
                    }
                }
            }
        }
    }

    private processComeback(game: GameWithHands, gameIndex: number) {
        const roundMap = new Map<number, Hand[]>();
        for (const hand of game.hands) {
            if (!roundMap.has(hand.ROUND)) roundMap.set(hand.ROUND, []);
            roundMap.get(hand.ROUND)!.push(hand);
        }
        const rounds = Array.from(roundMap.keys()).sort((a, b) => a - b);

        const teamIds = [game.TEAM_ID_1, game.TEAM_ID_2, game.TEAM_ID_3, game.TEAM_ID_4];
        const cumulativeScores = new Map<string, number>();
        const wasInLast = new Map<string, boolean>();
        const maxDeficit = new Map<string, number>();

        for (const teamId of teamIds) {
            cumulativeScores.set(teamId, 0);
            wasInLast.set(teamId, false);
            maxDeficit.set(teamId, 0);
        }

        for (const roundNum of rounds) {
            const handsInRound = roundMap.get(roundNum)!;
            for (const hand of handsInRound) {
                cumulativeScores.set(hand.TEAM_ID,
                    (cumulativeScores.get(hand.TEAM_ID) || 0) + hand.HAND_SCORE);
            }

            // Determine positions after this round
            const sorted = Array.from(cumulativeScores)
                .sort((a, b) => b[1] - a[1]);
            const lastTeamId = sorted[sorted.length - 1][0];
            const leaderScore = sorted[0][1];
            const lastScore = sorted[sorted.length - 1][1];

            wasInLast.set(lastTeamId, true);
            const currentDeficit = leaderScore - lastScore;
            if (currentDeficit > (maxDeficit.get(lastTeamId) || 0)) {
                maxDeficit.set(lastTeamId, currentDeficit);
            }
        }

        // Find winner (highest cumulative score at end)
        const finalSorted = Array.from(cumulativeScores)
            .sort((a, b) => b[1] - a[1]);
        const winnerTeamId = finalSorted[0][0];

        if (wasInLast.get(winnerTeamId)) {
            const deficit = maxDeficit.get(winnerTeamId) || 0;
            const teamData = this.idToPlayerData[winnerTeamId];
            teamData.addComeback(gameIndex, teamIds.length, deficit, false);
            for (const playerId of teamData.playerIds) {
                this.idToPlayerData[playerId].addComeback(
                    gameIndex, teamIds.length, deficit, teamData.playerIds.length > 1
                );
            }
        }
    }

    public finish() {
        Object.values(this.idToPlayerData).forEach((data) => { data.finish(); })
    }
}
