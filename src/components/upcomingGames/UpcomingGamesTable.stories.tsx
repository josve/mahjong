import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import {fn} from "storybook/test";
import UpcomingGamesTable from "@/components/upcomingGames/UpcomingGamesTable";
import {upcomingGames} from "@/stories/fixtures";

const meta = {
    title: "Components/UpcomingGames/UpcomingGamesTable",
    component: UpcomingGamesTable,
    args: {
        upcomingGames,
        onUpdate: fn(async () => {}),
        onDelete: fn(async () => {}),
    },
} satisfies Meta<typeof UpcomingGamesTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
    args: {upcomingGames: []},
};
