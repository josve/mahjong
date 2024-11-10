"use client"
import React, { useState, useEffect } from "react";
import {Box, Button, FormGroup, FormControlLabel, Switch, Snackbar, Alert } from "@mui/material";
import { RgbColorPicker } from "react-colorful";

interface ComponentParams {
    readonly session: any,
    readonly teamDetails: {
        [key: string]: {
            playerIds: string[];
            teamName: string;
            concatenatedName: string;
        };
    },
    readonly playerColors: {
        [player_id: string]: {
            color_red: number;
            color_green: number;
            color_blue: number;
        }
    }
}

export default function ProfilePageClient({ session, teamDetails, playerColors }: ComponentParams) {
    const user: any = session.user;

    const [color, setColor] = useState({
        r: user.COLOR_RED,
        g: user.COLOR_GREEN,
        b: user.COLOR_BLUE,
    });
    const [userTeams, setUserTeams] = useState<{
        playerIds: string[];
        teamName: string;
        concatenatedName: string;
    }[]>([]);

    const [showPreviousRoundScore, setShowPreviousRoundScore] = useState(
        user.SHOW_PREVIOUS_ROUND_SCORE
    );

    const [teamToColor, setTeamToColor] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const teamToColor: { [key: string]: string } = {};
        for (const team of userTeams) {
            let red = 0;
            let green = 0;
            let blue = 0;
            for (const playerId of team.playerIds) {
                if (playerId === user.PLAYER_ID) {
                    red += color.r;
                    green += color.g;
                    blue += color.b;
                } else {
                    red += playerColors[playerId].color_red;
                    green += playerColors[playerId].color_green;
                    blue += playerColors[playerId].color_blue;
                }
            }
            red /= team.playerIds.length;
            green /= team.playerIds.length;
            blue /= team.playerIds.length;
            teamToColor[team.teamName] = "rgb(" + red + "," + green + "," + blue + ")";
        }

        setTeamToColor(teamToColor);

    }, [userTeams, playerColors, color]);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    useEffect(() => {
        const teams = Object.values(teamDetails).filter((team: any) =>
            team.playerIds.includes(user.PLAYER_ID) && team.playerIds.length > 1
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
            <div style={{ paddingTop: "20px" }}>
                <h2>Dina lag</h2>
                {userTeams.map((team) => (
                    <div key={team.teamName} style={{paddingTop: "20px"}}>
                        <h3>{team.teamName}</h3>
                        <div style={{
                            paddingTop: "10px",
                        }}>
                            Spelare: {team.concatenatedName}
                        </div>
                        <Box style={{
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                        }}>
                            <span style={{paddingRight: "10px"}}>
                            Färg:
                            </span>
                            <div style={{
                                width: "30px",
                                display: "inline-block",
                                height: "30px",
                                borderRadius: "50%",
                                backgroundColor: teamToColor[team.teamName],
                            }}></div>
                        </Box>
                    </div>
                ))}
            </div>
            <Box sx={{paddingTop: "10px"}}>
                <Button
                    variant="contained"
                    color="secondary"
                    href="/api/auth/signout"
                    style={{ marginTop: "20px" }}
                >
                    Logga ut
                </Button>
            </Box>
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
