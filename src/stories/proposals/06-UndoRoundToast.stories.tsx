import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import UndoRoundToast from "@/components/proposals/UndoRoundToast";
import {activeMatch, roundDeltas, teamsOf} from "@/stories/proposals/data";

const meta = {
    title: "Förbättringsförslag/06 Ångra omgång",
    component: UndoRoundToast,
    args: {teams: teamsOf(activeMatch), rounds: roundDeltas(activeMatch)},
} satisfies Meta<typeof UndoRoundToast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sparad: Story = {};

export const IngenNotis: Story = {args: {initiallySaved: false}};
