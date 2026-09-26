import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import MatchCorrectPage from "@/app/match/[matchId]/correct/page";
import {activeMatch, oldMatch, session} from "@/stories/fixtures";
import {loggedIn} from "@/stories/mocks";

const meta = {
    title: "Pages/Match – korrigera resultat",
    component: MatchCorrectPage,
    parameters: {
        layout: "fullscreen",
        appLayout: {session: null},
        nextjs: {navigation: {pathname: `/match/${activeMatch.GAME_ID}/correct`}},
    },
    argTypes: {params: {control: false}},
    args: {params: Promise.resolve({matchId: activeMatch.GAME_ID})},
} satisfies Meta<typeof MatchCorrectPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveMatch: Story = loggedIn(session);

export const TooOld: Story = {
    ...loggedIn(session),
    args: {params: Promise.resolve({matchId: oldMatch.GAME_ID})},
};
