import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import React from "react";
import {limitHandMatch, relevantTeams, teamAndPlayerColors} from "@/stories/fixtures";
import {buildRounds} from "@/lib/rounds";
import LastRoundDisplay from "@/components/match/LastRoundDisplay";
import {ProposalProps} from "./playerResultData";
import Proposal01Standings from "./Proposal01Standings";
import Proposal02WindTiles from "./Proposal02WindTiles";
import Proposal03TeamColors from "./Proposal03TeamColors";
import Proposal04CompactTable from "./Proposal04CompactTable";
import Proposal05ScoreBars from "./Proposal05ScoreBars";
import Proposal06HeroWinner from "./Proposal06HeroWinner";
import Proposal07Sparkline from "./Proposal07Sparkline";
import Proposal08BeforeAfter from "./Proposal08BeforeAfter";
import Proposal09Table from "./Proposal09Table";
import Proposal10RoundStepper from "./Proposal10RoundStepper";

const rounds = buildRounds(limitHandMatch.hands);
// Round 9 has the limit hand.
const args: ProposalProps = {
    teamIdToName: relevantTeams(limitHandMatch),
    round: rounds[8],
    colors: teamAndPlayerColors,
    rounds,
};

const meta = {
    title: "Proposals/PlayerResults",
    component: Proposal01Standings,
    decorators: [(Story) => <div style={{maxWidth: 1100, padding: 8}}><Story/></div>],
    args,
} satisfies Meta<typeof Proposal01Standings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const P00Current: Story = {render: (a) => <LastRoundDisplay teamIdToName={a.teamIdToName} round={a.round}/>};
export const P01Standings: Story = {render: (a) => <Proposal01Standings {...a}/>};
export const P02WindTiles: Story = {render: (a) => <Proposal02WindTiles {...a}/>};
export const P03TeamColors: Story = {render: (a) => <Proposal03TeamColors {...a}/>};
export const P04CompactTable: Story = {render: (a) => <Proposal04CompactTable {...a}/>};
export const P05ScoreBars: Story = {render: (a) => <Proposal05ScoreBars {...a}/>};
export const P06HeroWinner: Story = {render: (a) => <Proposal06HeroWinner {...a}/>};
export const P07Sparkline: Story = {render: (a) => <Proposal07Sparkline {...a}/>};
export const P08BeforeAfter: Story = {render: (a) => <Proposal08BeforeAfter {...a}/>};
export const P09Table: Story = {render: (a) => <Proposal09Table {...a}/>};
export const P10RoundStepper: Story = {render: (a) => <Proposal10RoundStepper {...a}/>};
