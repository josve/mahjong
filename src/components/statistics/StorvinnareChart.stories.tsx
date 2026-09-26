import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import StorvinnareChart from "@/components/statistics/StorvinnareChart";
import {createStats} from "@/stories/fixtures";

const meta = {
    title: "Components/Statistics/StorvinnareChart",
    component: StorvinnareChart,
    args: {
        stats: createStats(),
        includeTeams: false,
    },
} satisfies Meta<typeof StorvinnareChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayersOnly: Story = {};

export const IncludingTeams: Story = {
    args: {includeTeams: true},
};
