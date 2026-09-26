import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import MatchHeader from "@/components/match/MatchHeader";
import {activeMatch, oldMatch} from "@/stories/fixtures";

// Async server component; the match is loaded from the mocked src/lib/dbMatch.ts.
const meta = {
    title: "Components/Match/MatchHeader (server)",
    component: MatchHeader,
    args: {
        matchId: activeMatch.GAME_ID,
        numRounds: 12,
    },
} satisfies Meta<typeof MatchHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithComment: Story = {};

export const WithoutComment: Story = {
    args: {matchId: oldMatch.GAME_ID, numRounds: 10},
};
