"use client";

import React from "react";
import { UpcomingGame } from "@/types/db";
import {
    Card,
    CardContent,
    Typography,
    styled,
    Box,
    Button,
    CardActions
} from "@mui/material";
import Link from "next/link";
import { formatDate, capitalize } from "@/lib/formatting";
import {Session} from "next-auth";
import {generateICS} from "@/lib/ics"; // Ensure these utilities are available

interface UpcomingGameCardProps {
    upcomingGame: UpcomingGame;
    session: Session | null;
}

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: '#ffffff',
    position: 'relative',
}));

export default function UpcomingGameCard({ upcomingGame, session }: UpcomingGameCardProps) {
    const gameTime = new Date(upcomingGame.game_time);
    const endTime = new Date(gameTime.getTime() + 4 * 60 * 60 * 1000);

    const handleDownloadICS = () => {
        const title = "Mahjong";
        const description = `Dags för nästa mahjong!`;
        const ics = generateICS({
            title,
            description,
            start: gameTime,
            end: endTime,
        });

        const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `upcoming_game_${upcomingGame.id}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Format the game time
    const formatTime = (date: Date) =>
        date.toLocaleTimeString("sv-SE", {hour: "2-digit", minute: "2-digit"});
    const timeString = formatTime(gameTime);
    const formattedDate = capitalize(formatDate(gameTime));

    return (
        <StyledCard className="upcoming-game-card">
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="div">
                        Nästa match
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formattedDate} ({timeString})
                    </Typography>
                </Box>
            </CardContent>
            {upcomingGame.meeting_link && session && (
                <CardActions>
                    <Button
                        variant="outlined"
                        color="secondary"
                        component={Link}
                        href={upcomingGame.meeting_link}
                        size="small"
                    >
                        Till videomötet
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleDownloadICS}
                        size="small"
                    >
                        Lägg till i kalender
                    </Button>
                </CardActions>)}
        </StyledCard>
    );
}