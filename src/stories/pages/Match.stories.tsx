import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import MatchPage from "@/app/match/[matchId]/page";
import {activeMatch, limitHandMatch, oldMatch, session} from "@/stories/fixtures";
import {loggedIn} from "@/stories/mocks";

const meta = {
    title: "Pages/Match",
    component: MatchPage,
    parameters: {
        layout: "fullscreen",
        appLayout: {session: null},
        nextjs: {navigation: {pathname: `/match/${activeMatch.GAME_ID}`}},
    },
    argTypes: {params: {control: false}},
    args: {params: Promise.resolve({matchId: activeMatch.GAME_ID})},
} satisfies Meta<typeof MatchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveMatch: Story = {};

export const ActiveMatchLoggedIn: Story = loggedIn(session);

export const FinishedMatch: Story = {
    args: {params: Promise.resolve({matchId: oldMatch.GAME_ID})},
};

export const LimitHandMatch: Story = {
    args: {params: Promise.resolve({matchId: limitHandMatch.GAME_ID})},
};
