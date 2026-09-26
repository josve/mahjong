"use client";

import React, {useState} from "react";
import {Box, Button, ButtonBase, Chip, Paper, Typography} from "@mui/material";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {ProposalTeam, TeamAvatar, WIND_CHARS} from "@/components/proposals/shared";

const SEATS = ["E", "S", "W", "N"] as const;
/** Grid placement of every seat around the table, east at the bottom. */
const SEAT_AREA: { [seat: string]: string } = {E: "bottom", S: "right", W: "top", N: "left"};

interface Props {
    readonly teams: ProposalTeam[];
    /** Suggested line ups, e.g. from suggestTeams(). */
    readonly suggestions?: string[][];
    readonly initialSeats?: (string | null)[];
}

/**
 * Förslag 5: Create a new match by tapping players onto a table instead of
 * picking them from four drop downs. Also lets the seats be shuffled.
 */
export default function SeatPicker({teams, suggestions = [], initialSeats = [null, null, null, null]}: Props) {
    const [seats, setSeats] = useState<(string | null)[]>(initialSeats);
    const byId = Object.fromEntries(teams.map((team) => [team.id, team]));

    const place = (teamId: string) => setSeats((prev) => {
        if (prev.includes(teamId)) return prev.map((id) => id === teamId ? null : id);
        const free = prev.indexOf(null);
        if (free === -1) return prev;
        return prev.map((id, index) => index === free ? teamId : id);
    });
    const shuffle = () => setSeats((prev) => [...prev].sort(() => Math.random() - 0.5));
    const full = seats.every(Boolean);

    return (
        <Paper elevation={0} sx={{p: 2, borderRadius: 3, border: "1px solid #eee", maxWidth: 560, backgroundColor: "white"}}>
            <Typography variant="h2" sx={{fontSize: 22, mb: 2}}>Ny match</Typography>

            <Box
                sx={{
                    display: "grid", gap: 1, mx: "auto", maxWidth: 380,
                    gridTemplateColumns: "1fr 1.4fr 1fr", gridTemplateRows: "auto 1fr auto",
                    gridTemplateAreas: `". top ." "left table right" ". bottom ."`,
                }}
            >
                <Box
                    sx={{
                        gridArea: "table", aspectRatio: "1", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
                        background: "radial-gradient(circle, #2F7D57 0%, #1E5A3E 100%)", boxShadow: "inset 0 0 0 6px #7A4A2A",
                    }}
                >
                    <Typography sx={{color: "rgba(255,255,255,0.5)", fontSize: 44}}>🀄</Typography>
                </Box>
                {SEATS.map((wind, index) => {
                    const team = seats[index] ? byId[seats[index]!] : null;
                    return (
                        <ButtonBase
                            key={wind}
                            onClick={() => team && place(team.id)}
                            sx={{
                                gridArea: SEAT_AREA[wind], flexDirection: "column", gap: 0.5, p: 1, borderRadius: 2, width: 96, height: 104, justifySelf: "center", alignSelf: "center",
                                border: "2px dashed", borderColor: team ? "transparent" : "#ddd",
                                backgroundColor: team ? "transparent" : "#fafafa",
                            }}
                        >
                            <Typography sx={{fontSize: 13, fontWeight: 700, color: wind === "E" ? "primary.main" : "#999"}}>
                                {WIND_CHARS[wind]} {wind === "E" ? "Öst" : wind === "S" ? "Syd" : wind === "W" ? "Väst" : "Norr"}
                            </Typography>
                            {team ? (
                                <>
                                    <Box sx={{position: "relative"}}>
                                        <TeamAvatar team={team} size={44}/>
                                        <CloseIcon sx={{position: "absolute", top: -6, right: -8, fontSize: 16, backgroundColor: "white", borderRadius: "50%", color: "#999"}}/>
                                    </Box>
                                    <Typography variant="body1" sx={{fontSize: 13, fontWeight: 700}}>{team.name}</Typography>
                                </>
                            ) : (
                                <Typography variant="body2" sx={{fontSize: 12}}>Tom plats</Typography>
                            )}
                        </ButtonBase>
                    );
                })}
            </Box>

            {suggestions.length > 0 && (
                <Box sx={{mt: 2, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center"}}>
                    <AutoAwesomeIcon sx={{fontSize: 18, color: "secondary.main"}}/>
                    <Typography variant="body2">Förslag:</Typography>
                    {suggestions.map((line) => (
                        <Chip
                            key={line.join()}
                            size="small"
                            variant="outlined"
                            label={line.map((id) => byId[id]?.name).join(" · ")}
                            onClick={() => setSeats(line)}
                        />
                    ))}
                </Box>
            )}

            <Typography variant="body2" sx={{mt: 2, mb: 1}}>Tryck på spelare för att sätta dem vid bordet</Typography>
            <Box sx={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))", gap: 1}}>
                {teams.map((team) => {
                    const seated = seats.includes(team.id);
                    return (
                        <ButtonBase
                            key={team.id}
                            onClick={() => place(team.id)}
                            disabled={!seated && full}
                            sx={{flexDirection: "column", gap: 0.5, p: 1, borderRadius: 2, opacity: seated ? 0.35 : !seated && full ? 0.5 : 1}}
                        >
                            <TeamAvatar team={team} size={40}/>
                            <Typography variant="body1" noWrap sx={{fontSize: 12, maxWidth: 72}}>{team.name}</Typography>
                        </ButtonBase>
                    );
                })}
            </Box>

            <Box sx={{display: "flex", gap: 1, mt: 2}}>
                <Button onClick={shuffle} disabled={!full} startIcon={<ShuffleIcon/>} sx={{backgroundColor: "#eee", color: "#606060"}}>
                    Slumpa platser
                </Button>
                <Button variant="contained" disabled={!full} sx={{flexGrow: 1}}>Starta match</Button>
            </Box>
        </Paper>
    );
}
