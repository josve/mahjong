import React, {useEffect, useState} from "react";
import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import SplitFlapScoreboard, {scoreboardTeams} from "@/components/match/SplitFlapScoreboard";
import {activeMatch, limitHandMatch, matchChartResponse} from "@/stories/fixtures";
import type {GameWithHands} from "@/types/db";

function teamsAfter(game: GameWithHands, round: number) {
    const {teamIdToName, teamColors} = matchChartResponse(game);
    return scoreboardTeams(game.hands.filter((hand) => hand.ROUND <= round), teamIdToName, teamColors);
}

/** Plays the match round by round to show the flip animations. */
function Replay({game}: { readonly game: GameWithHands }) {
    const lastRound = Math.max(...game.hands.map((hand) => hand.ROUND));
    const [round, setRound] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setRound(round >= lastRound ? 0 : round + 1), 2500);
        return () => clearTimeout(timer);
    }, [round, lastRound]);

    return <SplitFlapScoreboard teams={teamsAfter(game, round)} round={round}/>;
}

const meta = {
    title: "Components/Match/SplitFlapScoreboard",
    component: SplitFlapScoreboard,
    args: {
        teams: teamsAfter(activeMatch, 12),
        round: 12,
    },
} satisfies Meta<typeof SplitFlapScoreboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BeforeFirstRound: Story = {
    args: {teams: teamsAfter(activeMatch, 0), round: 0},
};

export const LimitHand: Story = {
    args: {teams: teamsAfter(limitHandMatch, 9), round: 9},
};

export const Replayed: Story = {
    render: () => <Replay game={activeMatch}/>,
};
