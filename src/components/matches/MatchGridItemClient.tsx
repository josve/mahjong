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
    styled,
    Chip
} from "@mui/material";
import { GameWithHands, IdToName } from "@/types/db";
import {LocalFireDepartment} from "@mui/icons-material";
import React from "react";
import NotificationsIcon from '@mui/icons-material/Notifications';

interface Props {
    readonly match: GameWithHands;
    readonly index: number;
    readonly idToName: IdToName;
}

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: '#ffffff', // Ensures the card background is white
    position: 'relative', // To position the active indicator absolutely within the card
}));

interface TeamScore {
    team: string;
    score: number;
}

export default function MatchGridItemClient({ index, match, idToName }: Props) {

    const hands = match.hands;
    const name = match.NAME;
    const time = match.TIME;

    const scores: { [key: string]: number } = {};

    const teams = [match.TEAM_ID_1, match.TEAM_ID_2, match.TEAM_ID_3, match.TEAM_ID_4];

    let hasLimitHand = false;

    for (const hand of match.hands) {
        if (!scores.hasOwnProperty(hand.TEAM_ID)) {
            scores[hand.TEAM_ID] = 500;
        }

        if (hand.HAND === 300) {
            hasLimitHand = true;
        }

        scores[hand.TEAM_ID] += hand.HAND_SCORE;
    }

    const teamScores: TeamScore[] = teams.map(team => ({
        team,
        score: scores[team] || 0, // Default to 0 if the score is undefined
    }));

    // Sort the array in descending order based on the score
    teamScores.sort((a, b) => b.score - a.score);

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

    const isActive =
        new Date().getTime() - match.TIME.getTime() < 24 * 60 * 60 * 1000;

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

                        {teamScores.map((teamScore) => (
                            <Typography key={teamScore.team} variant="body2" color="text.secondary" mt={1}>
                                <strong>{idToName[teamScore.team]}</strong>: {teamScore.score}
                            </Typography>
                        ))}
                        {match.COMMENT && (
                            <Typography variant="body2" color="text.secondary" mt={1}>
                                {match.COMMENT}
                            </Typography>
                        )}
                    </CardContent>

                    {hasLimitHand && (
                        <Chip
                            label="Limit hand"
                            color="error"
                            size="small"
                            icon={<LocalFireDepartment />}
                            sx={{
                                position: 'absolute',
                                bottom: 8,
                                right: 8,
                            }}
                        />
                    )}

                    {isActive && (
                        <Chip
                            label="Aktiv match"
                            color="primary"
                            size="small"
                            icon={<NotificationsIcon/>}
                            sx={{
                                position: 'absolute',
                                bottom: 8,
                                right: 8,
                            }}
                        />
                    )}
                </StyledCard>
            </CardActionArea>
        </Link>
    );
}