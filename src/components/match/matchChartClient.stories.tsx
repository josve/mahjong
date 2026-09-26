import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import MatchChartClient from "@/components/match/matchChartClient";
import {activeMatch, limitHandMatch, oldMatch, teamIdToPlayerIds} from "@/stories/fixtures";

// Loads its data from /api/matchChart, answered by the fetch mocks in src/stories/apiMocks.ts.
const meta = {
    title: "Components/Match/MatchChartClient",
    component: MatchChartClient,
    args: {
        matchId: activeMatch.GAME_ID,
        autoReload: false,
        showPreviousRoundScore: false,
        teamIdToPlayerIds,
        playerId: undefined,
        isEditable: true,
    },
} satisfies Meta<typeof MatchChartClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveMatch: Story = {};

export const FinishedMatch: Story = {
    args: {matchId: oldMatch.GAME_ID, isEditable: false},
};

export const LimitHand: Story = {
    args: {matchId: limitHandMatch.GAME_ID, isEditable: false},
};

export const ShowPreviousRoundScore: Story = {
    args: {showPreviousRoundScore: true},
};

export const Loading: Story = {
    parameters: {
        fetchMocks: [{url: "/api/matchChart", delay: Infinity}],
    },
};
