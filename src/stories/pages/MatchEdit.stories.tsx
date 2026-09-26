import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import MatchEditPage from "@/app/match/[matchId]/edit/page";
import {activeMatch, oldMatch, session} from "@/stories/fixtures";
import {loggedIn} from "@/stories/mocks";

const meta = {
    title: "Pages/Match – registrera resultat",
    component: MatchEditPage,
    parameters: {
        layout: "fullscreen",
        appLayout: {session: null},
        nextjs: {navigation: {pathname: `/match/${activeMatch.GAME_ID}/edit`}},
    },
    argTypes: {params: {control: false}},
    args: {params: Promise.resolve({matchId: activeMatch.GAME_ID})},
} satisfies Meta<typeof MatchEditPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveMatch: Story = loggedIn(session);

export const TooOld: Story = {
    ...loggedIn(session),
    args: {params: Promise.resolve({matchId: oldMatch.GAME_ID})},
};
