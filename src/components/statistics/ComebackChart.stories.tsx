import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import ComebackChart from "@/components/statistics/ComebackChart";
import {createStats} from "@/stories/fixtures";

const meta = {
    title: "Components/Statistics/ComebackChart",
    component: ComebackChart,
    args: {
        stats: createStats(),
        includeTeams: false,
    },
} satisfies Meta<typeof ComebackChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayersOnly: Story = {};

export const IncludingTeams: Story = {
    args: {includeTeams: true},
};
