"use client";

import React, {useState} from "react";
import {Box, Button, ButtonBase, Chip, IconButton, Paper, Typography} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {formatDelta, ProposalTeam, roundPayouts, TeamAvatar, WIND_CHARS} from "@/components/proposals/shared";

const QUICK_VALUES = [0, 8, 16, 24, 32, 48, 64];

interface Props {
    readonly teams: ProposalTeam[];
    readonly round: number;
    readonly initialHands?: { [teamId: string]: number };
    readonly initialEast?: string | null;
    readonly initialWinner?: string | null;
}

/**
 * Förslag 1: Register a round by tapping instead of typing in four text fields
 * and two drop downs. Shows how the scores will change before saving.
 */
export default function QuickRoundEntry({teams, round, initialHands = {}, initialEast = null, initialWinner = null}: Props) {
    const [hands, setHands] = useState<{ [teamId: string]: number }>(initialHands);
    const [east, setEast] = useState<string | null>(initialEast);
    // undefined = not chosen yet, null = no winner (draw).
    const [winner, setWinner] = useState<string | null | undefined>(initialWinner ?? undefined);

    const teamIds = teams.map((team) => team.id);
    const setHand = (teamId: string, value: number) => setHands((prev) => ({...prev, [teamId]: Math.max(0, value)}));

    const missing: string[] = [];
    if (teams.some((team) => hands[team.id] === undefined)) missing.push("poäng för alla");
    if (!east) missing.push("vem som sitter i öst");
    if (winner === undefined) missing.push("vinnare");
    const oddTeams = teams.filter((team) => (hands[team.id] ?? 0) % 2 !== 0);

    const complete = missing.length === 0 && oddTeams.length === 0;
    const payouts = complete ? roundPayouts(teamIds, hands, winner ?? null, east) : null;

    return (
        <Paper elevation={0} sx={{p: 2, borderRadius: 3, border: "1px solid #eee", maxWidth: 720, backgroundColor: "white"}}>
            <Box sx={{display: "flex", alignItems: "baseline", justifyContent: "space-between", mb: 2}}>
                <Typography variant="h2" sx={{fontSize: 22}}>Omgång {round}</Typography>
                <Typography variant="body2">Tryck på 東 för öst och 🏆 för vinnaren</Typography>
            </Box>

            <Box sx={{display: "grid", gridTemplateColumns: {xs: "1fr", sm: "1fr 1fr"}, gap: 1.5}}>
                {teams.map((team) => {
                    const isEast = east === team.id;
                    const isWinner = winner === team.id;
                    const value = hands[team.id];
                    return (
                        <Box
                            key={team.id}
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                border: "2px solid",
                                borderColor: isWinner ? "#E0B000" : "#eee",
                                backgroundColor: isWinner ? "#FFF9E0" : "var(--grid-background-color)",
                                transition: "all 0.15s",
                            }}
                        >
                            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                                <TeamAvatar team={team} size={32}/>
                                <Typography sx={{fontWeight: 700, flexGrow: 1}}>{team.name}</Typography>
                                <IconButton
                                    size="small"
                                    aria-label={`${team.name} sitter i öst`}
                                    aria-pressed={isEast}
                                    onClick={() => setEast(isEast ? null : team.id)}
                                    sx={{
                                        width: 34, height: 34, fontSize: 18, fontWeight: 700,
                                        color: isEast ? "white" : "#bbb",
                                        backgroundColor: isEast ? "primary.main" : "transparent",
                                        border: "1px solid", borderColor: isEast ? "primary.main" : "#ddd",
                                        "&:hover": {backgroundColor: isEast ? "primary.main" : "#f3f3f3"},
                                    }}
                                >
                                    {WIND_CHARS.E}
                                </IconButton>
                                <IconButton
                                    size="small"
                                    aria-label={`${team.name} vann`}
                                    aria-pressed={isWinner}
                                    onClick={() => setWinner(isWinner ? undefined : team.id)}
                                    sx={{
                                        width: 34, height: 34,
                                        color: isWinner ? "white" : "#bbb",
                                        backgroundColor: isWinner ? "#E0B000" : "transparent",
                                        border: "1px solid", borderColor: isWinner ? "#E0B000" : "#ddd",
                                        "&:hover": {backgroundColor: isWinner ? "#E0B000" : "#f3f3f3"},
                                    }}
                                >
                                    <EmojiEventsIcon fontSize="small"/>
                                </IconButton>
                            </Box>

                            <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", gap: 2, my: 1}}>
                                <IconButton aria-label="Minska med 2" onClick={() => setHand(team.id, (value ?? 0) - 2)}>
                                    <RemoveIcon/>
                                </IconButton>
                                <Typography
                                    sx={{
                                        fontSize: 36, fontWeight: 700, minWidth: 80, textAlign: "center",
                                        fontVariantNumeric: "tabular-nums",
                                        color: value === undefined ? "#ccc" : value % 2 ? "error.main" : "#333",
                                    }}
                                >
                                    {value ?? "–"}
                                </Typography>
                                <IconButton aria-label="Öka med 2" onClick={() => setHand(team.id, (value ?? 0) + 2)}>
                                    <AddIcon/>
                                </IconButton>
                            </Box>

                            <Box sx={{display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "center"}}>
                                {QUICK_VALUES.map((quick) => (
                                    <Chip
                                        key={quick}
                                        label={quick}
                                        size="small"
                                        clickable
                                        color={value === quick ? "primary" : "default"}
                                        onClick={() => setHand(team.id, quick)}
                                    />
                                ))}
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            <ButtonBase
                onClick={() => setWinner(winner === null ? undefined : null)}
                sx={{
                    mt: 1.5, px: 1.5, py: 0.5, borderRadius: 2, fontSize: 14,
                    color: winner === null ? "white" : "text.primary",
                    backgroundColor: winner === null ? "#606060" : "#f1f1f1",
                }}
            >
                Ingen vann (oavgjort)
            </ButtonBase>

            <Box sx={{mt: 2, p: 1.5, borderRadius: 2, backgroundColor: "#fafafa", border: "1px dashed #ddd"}}>
                <Typography variant="body2" sx={{mb: 1, fontWeight: 700}}>Förhandsvisning</Typography>
                {payouts ? (
                    <Box sx={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1}}>
                        {teams.map((team) => (
                            <Box key={team.id} sx={{textAlign: "center"}}>
                                <Typography variant="body2" noWrap>{team.name}</Typography>
                                <Typography
                                    sx={{
                                        fontWeight: 700, fontSize: 20,
                                        color: payouts[team.id] > 0 ? "#2E7D32" : payouts[team.id] < 0 ? "error.main" : "text.primary",
                                    }}
                                >
                                    {formatDelta(payouts[team.id])}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body2">
                        {oddTeams.length > 0
                            ? `Poängen måste vara jämna: ${oddTeams.map((team) => team.name).join(", ")}`
                            : `Saknas: ${missing.join(", ")}`}
                    </Typography>
                )}
            </Box>

            <Button variant="contained" fullWidth disabled={!complete} sx={{mt: 2}}>
                Spara omgång {round}
            </Button>
        </Paper>
    );
}
