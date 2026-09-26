import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import MatchChart from "@/components/match/matchChart";
import {activeMatch, session} from "@/stories/fixtures";
import {mockSession} from "@/stories/mocks";

// Async server component wrapping MatchChartClient with session and team data.
const meta = {
    title: "Components/Match/MatchChart (server)",
    component: MatchChart,
    args: {
        matchId: activeMatch.GAME_ID,
        autoReload: false,
        isEditable: true,
    },
} satisfies Meta<typeof MatchChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};

export const LoggedIn: Story = {
    beforeEach() {
        mockSession(session);
    },
};
