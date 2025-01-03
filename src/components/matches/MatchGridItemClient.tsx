import Link from "next/link";
import {
    formatDate,
    capitalize
} from "@/lib/formatting";
import {Box} from "@mui/material";
import {GameWithHands, IdToName} from "@/types/db";

interface Props {
    readonly match: GameWithHands;
    readonly index: number;
    readonly idToName: IdToName;
}

export default function MatchGridItemClient({ index, match, idToName }: Props) {

    const hands = match.hands;
    const name = match.NAME;
    const time = match.TIME;

    const scores: { [key: string]: number } = {};

    const teams = [match.TEAM_ID_1, match.TEAM_ID_2, match.TEAM_ID_3, match.TEAM_ID_4];

    for (const hand of match.hands) {
        if (!scores.hasOwnProperty(hand.TEAM_ID)) {
            scores[hand.TEAM_ID] = 500;
        }
        const newScore = scores[hand.TEAM_ID] + hand.HAND_SCORE;
        scores[hand.TEAM_ID] += hand.HAND_SCORE;
    }

    let bestScore = 0;
    let winnerTeam: string | undefined = undefined;
    for (const team of teams) {
        const score = scores[team];
        if (score > bestScore) {
            bestScore = score;
            winnerTeam = team;
        }
    }


    // generate a string with the time for the first and last rounds like (19:28-21:42)
    const firstRound = hands.length > 4 ? hands[4].TIME : hands[0].TIME;
    const lastRound = hands[hands.length - 1].TIME;

    // Find the number of rounds, this is the number of hands divided by 4
    const numberOfRounds = Math.floor(hands.length / 4 - 1);

    // Update time format
    const formatTime = (date: Date) =>
        date.toLocaleTimeString("sv-SE", {hour: "2-digit", minute: "2-digit"});
    const timeString = `${formatTime(new Date(firstRound))}-${formatTime(
        new Date(lastRound)
    )}`;

    return (
        <Link href={`/match/${match.GAME_ID}`}>
            <Box
                className="match-grid-item"
            >
                <div className="match-grid-item-number">
                    #{index}
                </div>
                <div className="match-grid-item-content">
                    <div className="match-grid-item-rounds">
                        {numberOfRounds} omgångar
                    </div>
                    <Box
                        className="match-grid-item-time label"
                    >
                        {capitalize(formatDate(time))} ({timeString})
                    </Box>
                    <Box
                        className="match-grid-item-time label"
                    >
                        {winnerTeam && (<>
                            <Box>
                                <b>{idToName[winnerTeam]}</b>: {bestScore}
                            </Box>
                        </>)}
                    </Box>


                    <div className="match-list-item-name">
                        {name}
                    </div>
                    <p className="match-round-info label">
                        {match.COMMENT}
                    </p>
                </div>
            </Box>
        </Link>
    );
}
