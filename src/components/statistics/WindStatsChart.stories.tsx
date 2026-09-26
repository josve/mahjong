import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import WindStatsChart from "@/components/statistics/WindStatsChart";
import {createStats} from "@/stories/fixtures";

const meta = {
    title: "Components/Statistics/WindStatsChart",
    component: WindStatsChart,
    args: {
        stats: createStats(),
        includeTeams: false,
    },
} satisfies Meta<typeof WindStatsChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayersOnly: Story = {};

export const IncludingTeams: Story = {
    args: {includeTeams: true},
};
