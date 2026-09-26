// Default responses for the app's API routes, installed for every story in .storybook/preview.tsx.
// Stories can add or override responses with the `fetchMocks` parameter.
import type {FetchMock} from "@/stories/fetchMock";
import {matchChartResponse, matches, matchesDesc, teamDetails, teamsResponse} from "@/stories/fixtures";
import {suggestTeams} from "@/lib/teamSuggestion";

export const matchChartMock: FetchMock = {
    url: "/api/matchChart",
    response: ({url}) => {
        const matchId = url.searchParams.get("matchId");
        return matchChartResponse(matches.find((m) => m.GAME_ID === matchId) ?? matches[0]);
    },
};

export const defaultFetchMocks: FetchMock[] = [
    matchChartMock,
    {url: "/api/teams", response: teamsResponse},
    {url: "/api/suggestedTeams", response: {teamIds: suggestTeams(matchesDesc, teamDetails)}},
    {url: "/api/matches", method: "POST", response: {success: true, gameId: "game-new"}},
    {url: "/api/addResult", method: "POST", response: {message: "Result added"}},
    {url: "/api/updateResult", method: "POST", response: {message: "Result updated"}},
    {url: "/api/updateProfile", method: "POST", response: {success: true}},
    {url: "/api/updateTeamName", method: "POST", response: {success: true}},
    {url: "/api/upcomingGames", method: "POST", response: {id: 99}},
    {url: /^\/api\/upcomingGames\/\d+/, response: {success: true}},
];
