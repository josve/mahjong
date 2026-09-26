import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import PlayerFormCard from "@/components/proposals/PlayerFormCard";
import {annaResults, soloTeams} from "@/stories/proposals/data";

const meta = {
    title: "Förbättringsförslag/08 Min form",
    component: PlayerFormCard,
    args: {player: soloTeams[0], results: annaResults, rank: 2, previousRank: 4, mahjongs: 31, rounds: 118},
} satisfies Meta<typeof PlayerFormCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Vinstsvit: Story = {
    args: {
        results: [...annaResults.slice(0, 7), ...annaResults.slice(-3).map((result) => ({...result, placement: 1, score: 640}))],
        rank: 1,
        previousRank: 1,
    },
};
