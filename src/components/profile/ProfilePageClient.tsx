"use client"
import React, { useState, useEffect } from "react";
import {Box, Button, FormGroup, FormControlLabel, Switch, Snackbar, Alert } from "@mui/material";
import { RgbColorPicker } from "react-colorful";

interface ComponentParams {
    readonly session: any,
    readonly teamDetails: any
}

export default function ProfilePageClient({ session, teamDetails }: ComponentParams) {
    const user: any = session.user;

    const [color, setColor] = useState({
        r: user.COLOR_RED,
        g: user.COLOR_GREEN,
        b: user.COLOR_BLUE,
    });
    const [showPreviousRoundScore, setShowPreviousRoundScore] = useState(
        user.SHOW_PREVIOUS_ROUND_SCORE
    );
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [userTeams, setUserTeams] = useState<any[]>([]);

    useEffect(() => {
        const teams = Object.values(teamDetails).filter((team: any) =>
            team.playerIds.includes(user.PLAYER_ID)
        );
        setUserTeams(teams);
    }, [teamDetails, user.PLAYER_ID]);

    const handleCheckboxChange = (event: any) => {
        setShowPreviousRoundScore(event.target.checked);
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        fetch("/api/updateProfile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                color_red: color.r,
                color_green: color.g,
                color_blue: color.b,
                show_previous_round_score: showPreviousRoundScore,
            }),
        })
            .then(() => {
                setSnackbarMessage("Profile updated successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            }).catch(() => {
                setSnackbarMessage("Failed to update profile.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            })
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{ backgroundColor: "var(--background-color)"}}>
            <h1 style={{paddingBottom: "10px" }}>{user?.name}</h1>
            <div>
                <div style={{paddingBottom: "20px"}}>Färg</div>
                <RgbColorPicker color={color} onChange={setColor} />
            </div>
            <FormGroup style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                 <FormControlLabel control={<Switch checked={showPreviousRoundScore} onChange={handleCheckboxChange}  />} label="Visa föregående rundpoäng" />
            </FormGroup>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
            >
                Uppdatera profil
            </Button>
            <Box sx={{ paddingTop: "10px"}}>
            <Button
                variant="contained"
                color="secondary"
                href="/api/auth/signout"
                style={{ marginTop: "20px" }}
            >
                Logga ut
            </Button>
            </Box>
            <div style={{ paddingTop: "20px" }}>
                <h2>Dina lag</h2>
                {userTeams.map((team) => (
                    <div key={team.teamName}>
                        <h3>{team.teamName}</h3>
                        <p>Spelare: {team.concatenatedName}</p>
                    </div>
                ))}
            </div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
