"use client"; // 1. Added "use client" directive

import Link from "next/link";
import {
    formatDate,
    capitalize
} from "@/lib/formatting";
import {
    Box,
    Card,
    CardContent,
    Typography,
    CardActionArea,
    styled
} from "@mui/material";
import { GameWithHands, IdToName } from "@/types/db";

interface Props {
    readonly match: GameWithHands;
    readonly index: number;
    readonly idToName: IdToName;
}

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: '#ffffff', // Ensures the card background is white
}));

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

    // Generate a string with the time for the first and last rounds like (19:28-21:42)
    const firstRound = hands.length > 4 ? hands[4].TIME : hands[0].TIME;
    const lastRound = hands[hands.length - 1].TIME;

    // Find the number of rounds, this is the number of hands divided by 4
    const numberOfRounds = Math.floor(hands.length / 4 - 1);

    // Update time format
    const formatTime = (date: Date) =>
        date.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
    const timeString = `${formatTime(new Date(firstRound))}-${formatTime(
        new Date(lastRound)
    )}`;

    return (
        <Link href={`/match/${match.GAME_ID}`} passHref legacyBehavior>
            <CardActionArea component="a">
                <StyledCard className="match-grid-card">
                    <CardContent>
                        {/* 2. Combined Header Row: Index, Game Name, and Rounds */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" component="div">
                                #{index} {name}
                            </Typography>
                            <Typography variant="body2" color="primary">
                                {numberOfRounds} omgångar
                            </Typography>
                        </Box>

                        {/* Row for "time" */}
                        <Box display="flex" justifyContent="flex-start" alignItems="center" mb={1}>
                            <Typography variant="body2" color="text.secondary">
                                {capitalize(formatDate(time))} ({timeString})
                            </Typography>
                        </Box>

                        {winnerTeam && (
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                <strong>{idToName[winnerTeam]}</strong>: {bestScore}
                            </Typography>
                        )}
                        {match.COMMENT && (
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                {match.COMMENT}
                            </Typography>
                        )}
                    </CardContent>
                </StyledCard>
            </CardActionArea>
        </Link>
    );
}