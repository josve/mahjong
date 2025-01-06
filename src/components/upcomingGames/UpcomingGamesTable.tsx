"use client";
import React, { useState } from "react";
import { UpcomingGame } from "@/types/db";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
    Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

interface UpcomingGamesTableProps {
    upcomingGames: UpcomingGame[];
    onUpdate: (id: number, gameTime: Date, meetingLink?: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export default function UpcomingGamesTable({
                                               upcomingGames,
                                               onUpdate,
                                               onDelete,
                                           }: UpcomingGamesTableProps) {
    const [editRowId, setEditRowId] = useState<number | null>(null);
    const [editGameTime, setEditGameTime] = useState<string>("");
    const [editMeetingLink, setEditMeetingLink] = useState<string>("");

    const handleEditClick = (game: UpcomingGame) => {
        setEditRowId(game.id);
        // Convert the Date to an ISO string suitable for <input type="datetime-local" />
        setEditGameTime(new Date(game.game_time).toISOString().slice(0, 16));
        setEditMeetingLink(game.meeting_link || "");
    };

    const handleCancelClick = () => {
        setEditRowId(null);
        setEditGameTime("");
        setEditMeetingLink("");
    };

    const handleSaveClick = async (id: number) => {
        // Convert string back to a JS date (assuming the string is in a valid format)
        const dateObj = new Date(editGameTime);

        await onUpdate(id, dateObj, editMeetingLink);
        handleCancelClick();
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Datum</TableCell>
                        <TableCell>Möteslänk</TableCell>
                        <TableCell align="right">Handlingar</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {upcomingGames.map((game) => (
                        <TableRow key={game.id}>
                            <TableCell>
                                {editRowId === game.id ? (
                                    <TextField
                                        type="datetime-local"
                                        value={editGameTime}
                                        onChange={(e) => setEditGameTime(e.target.value)}
                                        fullWidth
                                        size="small"
                                    />
                                ) : (
                                    new Date(game.game_time).toLocaleString()
                                )}
                            </TableCell>
                            <TableCell>
                                {editRowId === game.id ? (
                                    <TextField
                                        value={editMeetingLink}
                                        onChange={(e) => setEditMeetingLink(e.target.value)}
                                        fullWidth
                                        size="small"
                                    />
                                ) : (
                                    game.meeting_link || "-"
                                )}
                            </TableCell>
                            <TableCell align="right">
                                {editRowId === game.id ? (
                                    <>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleSaveClick(game.id)}
                                        >
                                            <SaveIcon />
                                        </IconButton>
                                        <IconButton color="inherit" onClick={handleCancelClick}>
                                            <CancelIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleEditClick(game)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => onDelete(game.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}