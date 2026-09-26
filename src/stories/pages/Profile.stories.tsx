import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import ProfilePage from "@/app/profile/page";
import {session} from "@/stories/fixtures";
import {loggedIn} from "@/stories/mocks";

const meta = {
    title: "Pages/Profil",
    component: ProfilePage,
    parameters: {
        layout: "fullscreen",
        appLayout: {session: null},
        nextjs: {navigation: {pathname: "/profile"}},
    },
} satisfies Meta<typeof ProfilePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = loggedIn(session);

export const LoggedOut: Story = {};
