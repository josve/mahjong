import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import ScoreboardDemo from "@/stories/scoreboard/ScoreboardDemo";
import BroadcastScoreboard from "@/components/match/scoreboard/BroadcastScoreboard";
import {limitHandMatch} from "@/stories/fixtures";

const meta = {
    title: "Poängtavla (koncept)/06 TV-sändning",
    component: ScoreboardDemo,
    args: {scoreboard: BroadcastScoreboard, mode: "live"},
    argTypes: {scoreboard: {table: {disable: true}}, game: {table: {disable: true}}},
} satisfies Meta<typeof ScoreboardDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Live: Story = {};

export const Slutresultat: Story = {args: {mode: "final"}};

export const LimitHand: Story = {args: {game: limitHandMatch}};
