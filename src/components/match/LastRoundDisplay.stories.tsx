import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import LastRoundDisplay from "@/components/match/LastRoundDisplay";
import {activeMatch, limitHandMatch, relevantTeams, roundFor} from "@/stories/fixtures";

const meta = {
    title: "Components/Match/LastRoundDisplay",
    component: LastRoundDisplay,
    args: {
        teamIdToName: relevantTeams(activeMatch),
        round: roundFor(activeMatch, 12),
    },
} satisfies Meta<typeof LastRoundDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LimitHand: Story = {
    args: {
        teamIdToName: relevantTeams(limitHandMatch),
        round: roundFor(limitHandMatch, 9),
    },
};

export const Hogmod: Story = {
    args: {round: roundFor(activeMatch, 7, 3)},
};
