import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import JarnhandChart from "@/components/statistics/JarnhandChart";
import {createStats} from "@/stories/fixtures";

const meta = {
    title: "Components/Statistics/JarnhandChart",
    component: JarnhandChart,
    args: {
        stats: createStats(),
        includeTeams: false,
    },
} satisfies Meta<typeof JarnhandChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayersOnly: Story = {};

export const IncludingTeams: Story = {
    args: {includeTeams: true},
};
