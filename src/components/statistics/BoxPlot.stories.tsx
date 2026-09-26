import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import BoxPlot from "@/components/statistics/BoxPlot";
import {createStats} from "@/stories/fixtures";

const meta = {
    title: "Components/Statistics/BoxPlot",
    component: BoxPlot,
    args: {
        stats: createStats(),
        includeTeams: false,
    },
} satisfies Meta<typeof BoxPlot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayersOnly: Story = {};

export const IncludingTeams: Story = {
    args: {includeTeams: true},
};
