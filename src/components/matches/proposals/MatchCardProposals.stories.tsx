import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import React from "react";
import {activeMatch, limitHandMatch, oldMatch, teamAndPlayerColors, teamIdToName} from "@/stories/fixtures";
import {ProposalProps} from "./matchCardData";
import Proposal01Podium from "./Proposal01Podium";
import Proposal02ScoreBars from "./Proposal02ScoreBars";
import Proposal03Sparkline from "./Proposal03Sparkline";
import Proposal04TeamColors from "./Proposal04TeamColors";
import Proposal05Compact from "./Proposal05Compact";
import Proposal06Live from "./Proposal06Live";
import Proposal07HeroWinner from "./Proposal07HeroWinner";
import Proposal08Tiles from "./Proposal08Tiles";
import Proposal09StatsFooter from "./Proposal09StatsFooter";
import Proposal10Expandable from "./Proposal10Expandable";

const args: ProposalProps = {index: 11, match: limitHandMatch, idToName: teamIdToName, colors: teamAndPlayerColors};

const meta = {
    title: "Proposals/MatchCards",
    component: Proposal01Podium,
    decorators: [(Story) => <div style={{maxWidth: 520}}><Story/></div>],
    args,
} satisfies Meta<typeof Proposal01Podium>;

export default meta;
type Story = StoryObj<typeof meta>;

export const P01Podium: Story = {render: (a) => <Proposal01Podium {...a}/>};
export const P02ScoreBars: Story = {render: (a) => <Proposal02ScoreBars {...a}/>};
export const P03Sparkline: Story = {render: (a) => <Proposal03Sparkline {...a}/>};
export const P04TeamColors: Story = {render: (a) => <Proposal04TeamColors {...a} match={oldMatch} index={10}/>};
export const P05Compact: Story = {
    render: (a) => (
        <div style={{display: "grid", gap: 8}}>
            <Proposal05Compact {...a} match={activeMatch} index={12}/>
            <Proposal05Compact {...a}/>
            <Proposal05Compact {...a} match={oldMatch} index={10}/>
        </div>
    ),
};
export const P06Live: Story = {render: (a) => <Proposal06Live {...a} match={activeMatch} index={12}/>};
export const P07HeroWinner: Story = {render: (a) => <Proposal07HeroWinner {...a}/>};
export const P08Tiles: Story = {render: (a) => <Proposal08Tiles {...a} match={oldMatch} index={10}/>};
export const P09StatsFooter: Story = {render: (a) => <Proposal09StatsFooter {...a}/>};
export const P10Expandable: Story = {render: (a) => <Proposal10Expandable {...a} defaultExpanded/>};
