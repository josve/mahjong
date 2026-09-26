import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import MatchSearchFilter from "@/components/proposals/MatchSearchFilter";
import {allTeams, searchableMatches} from "@/stories/proposals/data";

const meta = {
    title: "Förbättringsförslag/04 Sök och filtrera matcher",
    component: MatchSearchFilter,
    args: {matches: searchableMatches, teams: allTeams},
} satisfies Meta<typeof MatchSearchFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Alla: Story = {};

export const FiltreratPaSpelare: Story = {args: {initialTeams: ["t5", "t6"]}};

export const Sokning: Story = {args: {initialQuery: "nyår"}};
