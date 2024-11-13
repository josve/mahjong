import {GameWithHands, Hand, IdToColorMap, PlayerColor, PlayerOrTeam, TeamIdToPlayerIds} from "@/types/db";
import {Simulate} from "react-dom/test-utils";

export interface HighRollerInfo {
    gameIndex: number;
    hand: number;
    highRollerIndex: string;
    isTeam: boolean;
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

    public initGame(game: GameWithHands) {
        // Initialize scores for this match
        this.scores.push(this.scores.length > 0 ? this.scores[this.scores.length - 1] : 0);
    }

    public addGame(game: GameWithHands) {
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
        if (hand.HAND > 100) {
            this.highRollers.push({
                gameIndex: gameIndex,
                hand: hand.HAND,
                highRollerIndex: uuidv4(),
                isTeam: isPartOfTeam
            });
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
            console.log(playerOrTeam);
            console.log(teamAndPlayerColors);
            const stringColor = `rgb(${color.color_red}, ${color.color_green}, ${color.color_blue})`;
            const playerData =  new PlayerData(playerOrTeam, playerIds, stringColor);
            this.idToPlayerData[playerOrTeam.id] = playerData;
            this.playerDataList.push(playerData);
        });
    }

    public getNonTeamStats() {
        const result = [];
        for (const playerOrTeam of this.playerDataList) {
            if (playerOrTeam.isPlayer()) {
                result.push(playerOrTeam);
            }
        }

        return result;
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
    }

    public finish() {
        Object.values(this.idToPlayerData).forEach((data) => { data.finish(); })
    }


}