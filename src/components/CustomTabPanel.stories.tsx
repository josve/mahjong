import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import {CustomTabPanel} from "@/components/CustomTabPanel";

const meta = {
    title: "Components/CustomTabPanel",
    component: CustomTabPanel,
    args: {
        value: 0,
        index: 0,
        children: "Innehållet i fliken visas när value är lika med index.",
    },
} satisfies Meta<typeof CustomTabPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {};

export const Hidden: Story = {
    args: {value: 1},
};
