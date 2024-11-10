import {Hand, IdToColorMap, IdToName, MatchWithIdx} from "@/types/db";

export interface MatchChartResponse {
    hands: Hand[],
    teamIdToName: IdToName,
    teamColors: IdToColorMap,
    match: MatchWithIdx
}
