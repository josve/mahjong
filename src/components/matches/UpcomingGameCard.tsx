"use client";

import React from "react";
import { TeamDetails, UpcomingGame } from "@/types/db";
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
import {useTranslations} from "next-intl";

interface UpcomingGameCardProps {
    upcomingGame: UpcomingGame;
    session: Session | null;
    suggestedTeams?: TeamDetails[];
}

const StyledCard = styled(Card)(({ theme }) => ({
    backgroundColor: '#ffffff',
    position: 'relative',
}));

export default function UpcomingGameCard({ upcomingGame, session, suggestedTeams = [] }: UpcomingGameCardProps) {
    const t = useTranslations("matches");
    const gameTime = new Date(upcomingGame.game_time);
    const endTime = new Date(gameTime.getTime() + 4 * 60 * 60 * 1000);

    const handleDownloadICS = () => {
        const title = t("calendarTitle");
        const description = t("calendarDescription");
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
        <StyledCard className="upcoming-game-card" sx={{ height: "100%" }}>
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2
                    }}>
                    <Typography variant="h6" component="div">
                        {t("nextMatch")}
                    </Typography>
                    <Typography variant="body2" sx={{
                        color: "text.secondary"
                    }}>
                        {formattedDate} ({timeString})
                    </Typography>
                </Box>
                {suggestedTeams.length > 0 && (
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                            {t("suggestedTeams")}
                        </Typography>
                        {suggestedTeams.map((team) => (
                            <Typography key={team.id} variant="body2">
                                {team.teamName}
                                {team.teamName !== team.concatenatedName && ` (${team.concatenatedName})`}
                            </Typography>
                        ))}
                    </Box>
                )}
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
                        {t("toVideoMeeting")}
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleDownloadICS}
                        size="small"
                    >
                        {t("addToCalendar")}
                    </Button>
                </CardActions>)}
        </StyledCard>
    );
}