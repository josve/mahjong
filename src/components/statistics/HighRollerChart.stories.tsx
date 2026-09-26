import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import HighRollerChart from "@/components/statistics/HighRollerChart";
import {createStats} from "@/stories/fixtures";

const meta = {
    title: "Components/Statistics/HighRollerChart",
    component: HighRollerChart,
    args: {
        stats: createStats(),
        includeTeams: false,
    },
} satisfies Meta<typeof HighRollerChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayersOnly: Story = {};

export const IncludingTeams: Story = {
    args: {includeTeams: true},
};
