import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import MatchCardV2 from "@/components/proposals/MatchCardV2";
import {activeCard, limitHandCard, oldCard} from "@/stories/proposals/data";

const meta = {
    title: "Förbättringsförslag/03 Nytt matchkort",
    component: MatchCardV2,
    args: {match: limitHandCard},
} satisfies Meta<typeof MatchCardV2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LimitHand: Story = {};

export const Pagaende: Story = {args: {match: activeCard}};

export const Avslutad: Story = {args: {match: oldCard}};
