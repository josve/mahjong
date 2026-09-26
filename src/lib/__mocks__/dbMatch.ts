// Storybook mock of src/lib/dbMatch.ts, registered with sb.mock() in .storybook/preview.tsx.
import {fn} from "storybook/test";
import {
  allTeamsAndPlayers,
  matches,
  playerColors,
  playerEmails,
  teamAndPlayerColors,
  teamDetails,
  teamIdToName,
  teamIdToPlayerIds,
  toMatchWithIdx,
  totalStatistics,
} from "@/stories/fixtures";

const findMatch = (id: string) => matches.find((m) => m.GAME_ID === id) ?? matches[0];

export const getTotalStatistics = fn(async () => totalStatistics).mockName("getTotalStatistics");
export const getMatchById = fn(async (id: string) => toMatchWithIdx(findMatch(id))).mockName("getMatchById");
export const getTeamAndPlayerColors = fn(async () => teamAndPlayerColors).mockName("getTeamAndPlayerColors");
export const getTeamColors = fn(async () => teamAndPlayerColors).mockName("getTeamColors");
export const getPlayerColors = fn(async () => playerColors).mockName("getPlayerColors");
export const getPlayerEmails = fn(async (_playerId: string) => playerEmails).mockName("getPlayerEmails");
export const getHandsByGameId = fn(async (id: string) => findMatch(id).hands).mockName("getHandsByGameId");
export const getTeamIdToName = fn(async () => teamIdToName).mockName("getTeamIdToName");
export const fetchAllTeamsAndPlayers = fn(async () => allTeamsAndPlayers).mockName("fetchAllTeamsAndPlayers");
export const getTeamIdToPlayerIds = fn(async () => teamIdToPlayerIds).mockName("getTeamIdToPlayerIds");
export const getTeamDetails = fn(async () => teamDetails).mockName("getTeamDetails");
