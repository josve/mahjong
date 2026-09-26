import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import MahjongWinsChart from "@/components/statistics/MahjongWinsChart";
import {createStats} from "@/stories/fixtures";

const meta = {
    title: "Components/Statistics/MahjongWinsChart",
    component: MahjongWinsChart,
    args: {
        stats: createStats(),
        includeTeams: false,
    },
} satisfies Meta<typeof MahjongWinsChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayersOnly: Story = {};

export const IncludingTeams: Story = {
    args: {includeTeams: true},
};
