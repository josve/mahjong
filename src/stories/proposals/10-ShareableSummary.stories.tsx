import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import ShareableSummary from "@/components/proposals/ShareableSummary";
import {limitHandCard} from "@/stories/proposals/data";

const meta = {
    title: "Förbättringsförslag/10 Delbar matchsammanfattning",
    component: ShareableSummary,
    args: {
        matchName: limitHandCard.name,
        date: limitHandCard.date,
        rounds: limitHandCard.rounds,
        teams: limitHandCard.teams,
        highlights: [
            {icon: "🔥", label: "Största hand", value: "Björn · 300 (limit)"},
            {icon: "🀄", label: "Flest mahjong", value: "Frida · 5 st"},
            {icon: "🌬️", label: "Längsta öst", value: "Erik · 3 i rad"},
            {icon: "📈", label: "Största lyft", value: "Björn · +612"},
        ],
    },
} satisfies Meta<typeof ShareableSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};
