import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import NewMatchPage from "@/app/match/new/page";
import {session} from "@/stories/fixtures";
import {loggedIn} from "@/stories/mocks";

const meta = {
    title: "Pages/Ny match",
    component: NewMatchPage,
    parameters: {
        layout: "fullscreen",
        appLayout: {session: null},
        nextjs: {navigation: {pathname: "/match/new"}},
    },
} satisfies Meta<typeof NewMatchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = loggedIn(session);
