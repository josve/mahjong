import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import HogmodChart from "@/components/statistics/HogmodChart";
import {createStats} from "@/stories/fixtures";

const meta = {
    title: "Components/Statistics/HogmodChart",
    component: HogmodChart,
    args: {
        stats: createStats(),
        includeTeams: false,
    },
} satisfies Meta<typeof HogmodChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayersOnly: Story = {};

export const IncludingTeams: Story = {
    args: {includeTeams: true},
};
