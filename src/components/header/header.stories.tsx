import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import Header from "@/components/header/header";
import {session} from "@/stories/fixtures";
import {mockSession} from "@/stories/mocks";

// Async server component; the session comes from the mocked auth() in src/__mocks__/auth.ts.
const meta = {
    title: "Components/Header/Header (server)",
    component: Header,
    parameters: {layout: "fullscreen"},
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};

export const LoggedIn: Story = {
    beforeEach() {
        mockSession(session);
    },
};
