import React, {useEffect, useState} from "react";
import type {Meta, StoryObj} from "@storybook/nextjs-vite";
import MatchStandings, {standingsTeams} from "@/components/match/MatchStandings";
import {activeMatch, limitHandMatch, matchChartResponse} from "@/stories/fixtures";
import type {GameWithHands} from "@/types/db";

function teamsAfter(game: GameWithHands, round: number) {
    const {teamIdToName, teamColors} = matchChartResponse(game);
    return standingsTeams(game.hands.filter((hand) => hand.ROUND <= round), teamIdToName, teamColors);
}

/** Plays the match round by round to show the rows reordering. */
function Replay({game}: { readonly game: GameWithHands }) {
    const lastRound = Math.max(...game.hands.map((hand) => hand.ROUND));
    const [round, setRound] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setRound(round >= lastRound ? 0 : round + 1), 2500);
        return () => clearTimeout(timer);
    }, [round, lastRound]);

    return <MatchStandings teams={teamsAfter(game, round)} round={round}/>;
}

const meta = {
    title: "Components/Match/MatchStandings",
    component: MatchStandings,
    args: {
        teams: teamsAfter(activeMatch, 12),
        round: 12,
    },
} satisfies Meta<typeof MatchStandings>;

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
