import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import PlayerScoresChart from "@/components/statistics/PlayerScoresChart";
import {createStats} from "@/stories/fixtures";

const meta = {
    title: "Components/Statistics/PlayerScoresChart",
    component: PlayerScoresChart,
    args: {
        stats: createStats(),
        includeTeams: false,
    },
} satisfies Meta<typeof PlayerScoresChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayersOnly: Story = {};

export const IncludingTeams: Story = {
    args: {includeTeams: true},
};
