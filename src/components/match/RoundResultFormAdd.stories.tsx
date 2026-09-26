import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import RoundResultFormAdd from "@/components/match/RoundResultFormAdd";
import {activeMatch, relevantTeams} from "@/stories/fixtures";

const meta = {
    title: "Components/Match/RoundResultFormAdd",
    component: RoundResultFormAdd,
    args: {
        teamIdToName: relevantTeams(activeMatch),
        matchId: activeMatch.GAME_ID,
    },
} satisfies Meta<typeof RoundResultFormAdd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
