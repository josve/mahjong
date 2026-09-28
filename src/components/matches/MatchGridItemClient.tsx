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
import { GameWithHands, IdToColorMap, IdToName } from "@/types/db";
import React from "react";
import MatchBadges from "@/components/matches/MatchBadges";
import MatchSparkline from "@/components/matches/MatchSparkline";
import { MatchRecords } from "@/lib/matchRecords";

interface Props {
    readonly match: GameWithHands;
    readonly index: number;
    readonly idToName: IdToName;
    readonly records: MatchRecords;
    readonly colors?: IdToColorMap;
}

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: '#ffffff', // Ensures the card background is white
    position: 'relative', // To position the active indicator absolutely within the card
    height: '100%', // Fill the grid cell so cards in the same row get equal height
    display: 'flex',
    flexDirection: 'column',
}));

export default function MatchGridItemClient({ index, match, idToName, records, colors }: Props) {

    const hands = match.hands;
    const name = match.NAME;
    const time = match.TIME;

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
            <CardActionArea component="a" sx={{ height: "100%" }}>
                <StyledCard className="match-grid-card">
                    <CardContent sx={{ flexGrow: 1 }}>
                        {/* 2. Combined Header Row: Index, Game Name, and Rounds */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2
                            }}>
                            <Typography variant="h6" component="div">
                                #{index} {name}
                            </Typography>
                            <Typography variant="body2" color="primary">
                                {numberOfRounds} omgångar
                            </Typography>
                        </Box>

                        {/* Row for "time" */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                mb: 1
                            }}>
                            <Typography variant="body2" sx={{
                                color: "text.secondary"
                            }}>
                                {capitalize(formatDate(time))} ({timeString})
                            </Typography>
                        </Box>

                        <MatchSparkline match={match} idToName={idToName} colors={colors} />
                        {match.COMMENT && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    mt: 1
                                }}>
                                {match.COMMENT}
                            </Typography>
                        )}
                    </CardContent>

                    <MatchBadges match={match} records={records} />
                </StyledCard>
            </CardActionArea>
        </Link>
    );
}