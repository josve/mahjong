import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import {mocked} from "storybook/test";
import Home from "@/app/page";
import {getNextUpcomingGame} from "@/lib/db/upcomingGame";
import fetchMatches from "@/lib/fetchMatches";
import {matchesDesc, session} from "@/stories/fixtures";
import {loggedIn} from "@/stories/mocks";

const meta = {
    title: "Pages/Matcher",
    component: Home,
    parameters: {
        layout: "fullscreen",
        appLayout: {session: null},
        nextjs: {navigation: {pathname: "/"}},
    },
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};

export const LoggedIn: Story = loggedIn(session);

export const NoUpcomingGame: Story = {
    beforeEach() {
        mocked(getNextUpcomingGame).mockResolvedValue(null);
    },
};

export const SingleMatch: Story = {
    beforeEach() {
        mocked(fetchMatches).mockResolvedValue(matchesDesc.slice(0, 1));
    },
};
