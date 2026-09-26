import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import AverageHandTable from "@/components/statistics/AverageHandTable";
import {createStats} from "@/stories/fixtures";

const meta = {
    title: "Components/Statistics/AverageHandTable",
    component: AverageHandTable,
    args: {
        stats: createStats(),
        includeTeams: false,
    },
} satisfies Meta<typeof AverageHandTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayersOnly: Story = {};

export const IncludingTeams: Story = {
    args: {includeTeams: true},
};
