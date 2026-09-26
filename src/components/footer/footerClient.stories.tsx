import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import FooterClient from "@/components/footer/footerClient";
import {session} from "@/stories/fixtures";

// The footer is only visible on small screens, so the stories use a mobile viewport.
const meta = {
    title: "Components/Footer/FooterClient",
    component: FooterClient,
    parameters: {layout: "fullscreen"},
    globals: {viewport: {value: "mobile1", isRotated: false}},
    args: {session: null},
} satisfies Meta<typeof FooterClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};

export const LoggedIn: Story = {
    args: {session},
};
