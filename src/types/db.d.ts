export interface TotalStatistics {
    totalMatches: number;
    totalMahjongs: number;
    totalRounds: number;
}

export interface Match {
    GAME_ID: string;
    TIME: Date;
    NAME: string;
    COMMENT: string;
    TEAM_ID_1: string;
    TEAM_ID_2: string;
    TEAM_ID_3: string;
    TEAM_ID_4: string;
    IS_TEST: boolean;
    GAME_IDX: number;
}

export interface MatchWithIdx extends Match {
    GAME_IDX: number;
}

export interface PlayerColor {
    color_red: number;
    color_green: number;
    color_blue: number;

}

export interface IdToColorMap {
    [team_id: string]: PlayerColor
}

export interface Hand {
    ROUND: number;
    GAME_ID: string;
    TIME: Date;
    HAND: number;
    IS_WINNER: boolean;
    WIND: string;
    TEAM_ID: string;
    HAND_SCORE: number;
    IS_TEST: boolean;
}

export interface IdToName {
    [teamId: string]: string
}

export interface SimplePlayer {
 id: string;
 name: string
}

export interface PlayerOrTeam extends SimplePlayer {}

export interface TeamIdToPlayerIds {
    [key: string]: string[];
}

export interface TeamDetails {
    id: string;
    playerIds: string[];
    teamName: string;
    concatenatedName: string;
}

export interface TeamIdToDetails {
    [key: string]: TeamDetails;
}

export interface Game {
    GAME_ID: string;
    TIME: Date;
    NAME: string;
    COMMENT: string;
    TEAM_ID_1: string;
    TEAM_ID_2: string;
    TEAM_ID_3: string;
    TEAM_ID_4: string;
    IS_TEST: boolean;
}

export interface GameWithHands extends Game {
    hands: Hand[];
}

export interface UpcomingGame {
    id: number;
    game_time: Date;
    meeting_link?: string | null; // Nullable field
    created_at: Date;
}