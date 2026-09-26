import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import Footer from "@/components/footer/footer";
import {session} from "@/stories/fixtures";
import {mockSession} from "@/stories/mocks";

// Async server component; the session comes from the mocked auth() in src/__mocks__/auth.ts.
const meta = {
    title: "Components/Footer/Footer (server)",
    component: Footer,
    parameters: {layout: "fullscreen"},
    globals: {viewport: {value: "mobile1", isRotated: false}},
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};

export const LoggedIn: Story = {
    beforeEach() {
        mockSession(session);
    },
};
