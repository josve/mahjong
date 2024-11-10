import {GameWithHands, Hand, IdToColorMap, IdToName, MatchWithIdx, SimplePlayer, TeamIdToPlayerIds} from "@/types/db";

export interface MatchChartResponse {
    hands: Hand[],
    teamIdToName: IdToName,
    teamColors: IdToColorMap,
    match: MatchWithIdx
}

export interface MatchesResponse {
    success: boolean;
    gameId: string;
}

export interface AddResultResponse {
    message: string;
}

export interface StatisticsResponse {
    allPlayers: SimplePlayer[];
    teamIdToName: IdToName;
    teamIdToPlayerIds: TeamIdToPlayerIds;
    playerColors: IdToColorMap;
    matches: GameWithHands[];
}

export interface TeamsResponse {
    id: string;
    name: string;
    concatenatedName: string;
    playerIds: string[];
}

export interface UpdateProfileResponse {
    success: boolean;
}

export interface UpdateResultResponse  {
    message: string;
}