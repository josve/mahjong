import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import AdminUpcomingGamesPage from "@/components/upcomingGames/AdminUpcomingGamesPage";
import {session, upcomingGames} from "@/stories/fixtures";

const meta = {
    title: "Components/UpcomingGames/AdminUpcomingGamesPage",
    component: AdminUpcomingGamesPage,
    args: {
        session,
        upcomingGames,
    },
} satisfies Meta<typeof AdminUpcomingGamesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoUpcomingGames: Story = {
    args: {upcomingGames: []},
};

export const ApiError: Story = {
    parameters: {
        fetchMocks: [{url: "/api/upcomingGames", status: 500, response: {error: "Kunde inte spara matchen"}}],
    },
};
