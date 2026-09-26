import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import HeaderClient from "@/components/header/headerClient";
import {session} from "@/stories/fixtures";

const meta = {
    title: "Components/Header/HeaderClient",
    component: HeaderClient,
    parameters: {layout: "fullscreen"},
    args: {session: null},
} satisfies Meta<typeof HeaderClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {};

export const LoggedIn: Story = {
    args: {session},
};
