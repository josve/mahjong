import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import QuickRoundEntry from "@/components/proposals/QuickRoundEntry";
import {activeMatch, numRounds, teamsOf} from "@/stories/proposals/data";

const teams = teamsOf(activeMatch);

const meta = {
    title: "Förbättringsförslag/01 Snabbregistrering av omgång",
    component: QuickRoundEntry,
    args: {teams, round: numRounds(activeMatch) + 1},
} satisfies Meta<typeof QuickRoundEntry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tom: Story = {};

export const Ifylld: Story = {
    args: {
        initialHands: {[teams[0].id]: 48, [teams[1].id]: 8, [teams[2].id]: 16, [teams[3].id]: 0},
        initialEast: teams[1].id,
        initialWinner: teams[0].id,
    },
};

export const UddaPoang: Story = {
    args: {
        initialHands: {[teams[0].id]: 48, [teams[1].id]: 7, [teams[2].id]: 16, [teams[3].id]: 0},
        initialEast: teams[1].id,
        initialWinner: teams[0].id,
    },
};
