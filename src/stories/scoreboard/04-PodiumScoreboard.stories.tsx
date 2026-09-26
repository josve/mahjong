import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import ScoreboardDemo from "@/stories/scoreboard/ScoreboardDemo";
import PodiumScoreboard from "@/components/match/scoreboard/PodiumScoreboard";
import {limitHandMatch} from "@/stories/fixtures";

const meta = {
    title: "Poängtavla (koncept)/04 Podium",
    component: ScoreboardDemo,
    args: {scoreboard: PodiumScoreboard, mode: "live"},
    argTypes: {scoreboard: {table: {disable: true}}, game: {table: {disable: true}}},
} satisfies Meta<typeof ScoreboardDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Live: Story = {};

export const Slutresultat: Story = {args: {mode: "final"}};

export const LimitHand: Story = {args: {game: limitHandMatch}};
