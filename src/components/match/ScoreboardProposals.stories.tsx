import React from "react";
import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import {Box} from "@mui/material";
import {scoreboardTeams} from "@/components/match/SplitFlapScoreboard";
import {ListCard, TableSection, Tiles} from "@/components/match/ScoreboardProposals";
import {activeMatch, matchChartResponse} from "@/stories/fixtures";

const {teamIdToName, teamColors} = matchChartResponse(activeMatch);

const meta = {
    title: "Proposals/Scoreboard",
    component: ListCard,
    args: {teams: scoreboardTeams(activeMatch.hands.filter((h) => h.ROUND <= 12), teamIdToName, teamColors), round: 12},
    decorators: [(Story) => <Box sx={{maxWidth: 1112, mx: "auto", p: 2}}><Story/></Box>],
} satisfies Meta<typeof ListCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const A_ListCard: Story = {};
export const B_Tiles: Story = {render: (args) => <Tiles {...args}/>};
export const C_Table: Story = {render: (args) => <TableSection {...args}/>};
