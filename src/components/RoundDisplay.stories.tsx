import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import RoundDisplay from "@/components/RoundDisplay";
import {activeMatch, handsForRound, relevantTeams} from "@/stories/fixtures";

const meta = {
    title: "Components/RoundDisplay",
    component: RoundDisplay,
    args: {
        round: "3",
        hands: handsForRound(activeMatch, 3),
        matchId: activeMatch.GAME_ID,
        teamIdToName: relevantTeams(activeMatch),
    },
} satisfies Meta<typeof RoundDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
