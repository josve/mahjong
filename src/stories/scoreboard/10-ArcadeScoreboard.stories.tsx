import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import ScoreboardDemo from "@/stories/scoreboard/ScoreboardDemo";
import ArcadeScoreboard from "@/components/match/scoreboard/ArcadeScoreboard";
import {limitHandMatch} from "@/stories/fixtures";

const meta = {
    title: "Poängtavla (koncept)/10 Arkad",
    component: ScoreboardDemo,
    args: {scoreboard: ArcadeScoreboard, mode: "live"},
    argTypes: {scoreboard: {table: {disable: true}}, game: {table: {disable: true}}},
} satisfies Meta<typeof ScoreboardDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Live: Story = {};

export const Slutresultat: Story = {args: {mode: "final"}};

export const LimitHand: Story = {args: {game: limitHandMatch}};
