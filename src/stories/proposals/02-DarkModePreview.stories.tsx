import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import DarkModePreview from "@/components/proposals/DarkModePreview";
import {activeMatch, limitHandMatch, teamScores} from "@/stories/proposals/data";

const meta = {
    title: "Förbättringsförslag/02 Mörkt läge",
    component: DarkModePreview,
    args: {
        matches: [
            {name: activeMatch.NAME, active: true, teams: teamScores(activeMatch)},
            {name: limitHandMatch.NAME, teams: teamScores(limitHandMatch)},
        ],
    },
} satisfies Meta<typeof DarkModePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LjustOchMorkt: Story = {args: {sideBySide: true}};

export const Vaxlingsbar: Story = {};
