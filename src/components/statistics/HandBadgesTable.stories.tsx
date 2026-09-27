import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import HandBadgesTable from "@/components/statistics/HandBadgesTable";
import {createStats} from "@/stories/fixtures";

const meta = {
    title: "Components/Statistics/HandBadgesTable",
    component: HandBadgesTable,
    args: {
        stats: createStats(),
        includeTeams: false,
    },
} satisfies Meta<typeof HandBadgesTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayersOnly: Story = {};

export const IncludingTeams: Story = {
    args: {includeTeams: true},
};
