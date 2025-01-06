"use client";
import React, { useState } from "react";
import { UpcomingGame } from "@/types/db";
import { Session } from "next-auth";
import {
    Typography,
    Box,
    Paper,
    Button,
    TextField,
    Stack,
    Alert,
} from "@mui/material";
import UpcomingGamesTable from "./UpcomingGamesTable";
import moment from 'moment';

interface AdminUpcomingGamesPageProps {
    session: Session;
    upcomingGames: UpcomingGame[];
}

export default function AdminUpcomingGamesPage({
                                                   session,
                                                   upcomingGames,
                                               }: AdminUpcomingGamesPageProps) {
    const user = session.user;

    // If you have an admin check, you can do it here:
    if (!user) {
        return <Typography variant="h6">Access Denied</Typography>;
    }

    const [games, setGames] = useState<UpcomingGame[]>(upcomingGames);
    let initialDate = new Date();
    initialDate.setHours(19, 0, 0);

    const [newGameTime, setNewGameTime] = useState<string>(moment(initialDate).months(1).format('YYYY-MM-DD HH:mm:ss'));
    const [newMeetingLink, setNewMeetingLink] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    /**
     * Handle creating a new upcoming game (POST to /api/upcomingGames).
     */
    const handleCreateGame = async () => {
        setErrorMessage("");

        try {
            if (!newGameTime) {
                setErrorMessage("Du måste välja en tid");
                return;
            }

            const response = await fetch("/api/upcomingGames", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    gameTime: newGameTime,
                    meetingLink: newMeetingLink || null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to create game");
            }

            const { id } = await response.json();

            // Optimistically update the UI with the new game
            const createdGame: UpcomingGame = {
                id: id,
                game_time: new Date(newGameTime),
                meeting_link: newMeetingLink || null,
                created_at: new Date(),
            };

            setGames((prev) => [...prev, createdGame]);
            setNewGameTime("");
            setNewMeetingLink("");
        } catch (error: any) {
            setErrorMessage(error.message || "Failed to create game");
        }
    };

    /**
     * Handle updating a game (PUT to /api/upcomingGames/[id]).
     */
    const handleUpdateGame = async (
        id: number,
        gameTime: Date,
        meetingLink?: string
    ) => {
        setErrorMessage("");

        try {
            const response = await fetch(`/api/upcomingGames/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    gameTime,
                    meetingLink: meetingLink || null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update game");
            }

            // Update local state
            setGames((prevGames) =>
                prevGames.map((g) =>
                    g.id === id
                        ? {
                            ...g,
                            game_time: gameTime,
                            meeting_link: meetingLink || null,
                        }
                        : g
                )
            );
        } catch (error: any) {
            setErrorMessage(error.message || "Failed to update game");
        }
    };

    /**
     * Handle deleting a game (DELETE to /api/upcomingGames/[id]).
     */
    const handleDeleteGame = async (id: number) => {
        setErrorMessage("");

        try {
            const response = await fetch(`/api/upcomingGames/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete game");
            }

            // Update local state
            setGames((prev) => prev.filter((g) => g.id !== id));
        } catch (error: any) {
            setErrorMessage(error.message || "Failed to delete game");
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Administrera kommande matcher
            </Typography>

            {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Alert>
            )}

            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6" style={{ paddingBottom: 10 }} gutterBottom>
                    Skapa en ny kommande match
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        label="Datum"
                        type="datetime-local"
                        value={newGameTime}
                        onChange={(e) => setNewGameTime(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Möteslänk"
                        type="text"
                        value={newMeetingLink}
                        onChange={(e) => setNewMeetingLink(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleCreateGame}>
                        Skapa
                    </Button>
                </Stack>
            </Paper>

            <UpcomingGamesTable
                upcomingGames={games}
                onUpdate={handleUpdateGame}
                onDelete={handleDeleteGame}
            />
        </Box>
    );
}