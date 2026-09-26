import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import {mocked} from "storybook/test";
import UpcomingGamesPage from "@/app/upcomingGames/page";
import {getAllUpcomingGames} from "@/lib/db/upcomingGame";
import {session} from "@/stories/fixtures";
import {loggedIn, mockSession} from "@/stories/mocks";

const meta = {
    title: "Pages/Kommande matcher",
    component: UpcomingGamesPage,
    parameters: {
        layout: "fullscreen",
        appLayout: {session: null},
        nextjs: {navigation: {pathname: "/upcomingGames"}},
    },
} satisfies Meta<typeof UpcomingGamesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = loggedIn(session);

export const NoUpcomingGames: Story = {
    parameters: loggedIn(session).parameters,
    beforeEach() {
        mockSession(session);
        mocked(getAllUpcomingGames).mockResolvedValue([]);
    },
};

export const LoggedOut: Story = {};
