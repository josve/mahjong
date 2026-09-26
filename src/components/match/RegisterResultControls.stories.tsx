import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import RegisterResultControls from "@/components/match/RegisterResultControls";
import {activeMatch, oldMatch} from "@/stories/fixtures";

// Async server component; the match is loaded from the mocked src/lib/dbMatch.ts.
const meta = {
    title: "Components/Match/RegisterResultControls (server)",
    component: RegisterResultControls,
    args: {matchId: activeMatch.GAME_ID},
} satisfies Meta<typeof RegisterResultControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Editable: Story = {};

export const TooOld: Story = {
    args: {matchId: oldMatch.GAME_ID},
};
