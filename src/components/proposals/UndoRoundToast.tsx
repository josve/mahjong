"use client";

import React, {useEffect, useState} from "react";
import {Box, Button, LinearProgress, Paper, Slide, Typography} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UndoIcon from "@mui/icons-material/Undo";
import {formatDelta, ProposalTeam, TeamAvatar} from "@/components/proposals/shared";

const UNDO_SECONDS = 10;

interface RoundRow {
    round: number;
    deltas: { [teamId: string]: number };
}

interface Props {
    readonly teams: ProposalTeam[];
    readonly rounds: RoundRow[];
    /** Show the toast for the last round right away. */
    readonly initiallySaved?: boolean;
}

function Toast({round, teams, onUndo, onClose}: {
    readonly round: RoundRow;
    readonly teams: ProposalTeam[];
    readonly onUndo: () => void;
    readonly onClose: () => void;
}) {
    const [left, setLeft] = useState(UNDO_SECONDS);

    useEffect(() => {
        const timer = setInterval(() => setLeft((prev) => prev - 0.1), 100);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        if (left <= 0) onClose();
    }, [left, onClose]);

    return (
        <Paper elevation={8} sx={{borderRadius: 3, overflow: "hidden", backgroundColor: "#2B2626", color: "white", minWidth: 320}}>
            <Box sx={{display: "flex", alignItems: "center", gap: 1.5, p: 1.5}}>
                <CheckCircleIcon sx={{color: "#7BD389"}}/>
                <Box sx={{flexGrow: 1}}>
                    <Typography sx={{color: "white", fontWeight: 700}}>Omgång {round.round} sparad</Typography>
                    <Box sx={{display: "flex", gap: 1.5, mt: 0.5}}>
                        {teams.map((team) => (
                            <Box key={team.id} sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                                <TeamAvatar team={team} size={18}/>
                                <Typography sx={{fontSize: 13, color: round.deltas[team.id] >= 0 ? "#7BD389" : "#FF8A80"}}>
                                    {formatDelta(round.deltas[team.id])}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Button onClick={onUndo} startIcon={<UndoIcon/>} sx={{backgroundColor: "transparent", color: "#FFB4A8", fontWeight: 700, px: 1.5}}>
                    Ångra
                </Button>
            </Box>
            <LinearProgress
                variant="determinate"
                value={(left / UNDO_SECONDS) * 100}
                sx={{height: 3, backgroundColor: "transparent", "& .MuiLinearProgress-bar": {backgroundColor: "#FFB4A8"}}}
            />
        </Paper>
    );
}

/**
 * Förslag 6: Confirm a saved round with a toast that lets you undo it for ten
 * seconds, instead of reloading the page and having to go to "Rätta" when a
 * score was wrong.
 */
export default function UndoRoundToast({teams, rounds: initialRounds, initiallySaved = true}: Props) {
    const [rounds, setRounds] = useState(initialRounds);
    const [toastFor, setToastFor] = useState<RoundRow | null>(initiallySaved ? initialRounds[initialRounds.length - 1] : null);

    const saveRandomRound = () => {
        const next: RoundRow = {
            round: rounds.length + 1,
            deltas: Object.fromEntries(teams.map((team, index) => [team.id, [48, -16, -8, -24][index]])),
        };
        setRounds((prev) => [...prev, next]);
        setToastFor(next);
    };
    const undo = () => {
        setRounds((prev) => prev.filter((row) => row !== toastFor));
        setToastFor(null);
    };

    return (
        <Box sx={{position: "relative", maxWidth: 560, minHeight: 420, pb: 12}}>
            <Paper elevation={0} sx={{borderRadius: 3, border: "1px solid #eee", overflow: "hidden", backgroundColor: "white"}}>
                <Box sx={{display: "grid", gridTemplateColumns: `60px repeat(${teams.length}, 1fr)`, backgroundColor: "#fafafa", p: 1}}>
                    <Typography variant="body2">#</Typography>
                    {teams.map((team) => (
                        <Box key={team.id} sx={{display: "flex", alignItems: "center", gap: 0.5}}>
                            <TeamAvatar team={team} size={20}/>
                            <Typography variant="body2" noWrap>{team.name}</Typography>
                        </Box>
                    ))}
                </Box>
                {rounds.slice(-6).map((row) => (
                    <Box
                        key={row.round}
                        sx={{
                            display: "grid", gridTemplateColumns: `60px repeat(${teams.length}, 1fr)`, p: 1, borderTop: "1px solid #f1f1f1",
                            backgroundColor: row === toastFor ? "#F1FAF2" : "white", transition: "background-color 0.3s",
                        }}
                    >
                        <Typography variant="body2">{row.round}</Typography>
                        {teams.map((team) => (
                            <Typography key={team.id} variant="body1" sx={{fontVariantNumeric: "tabular-nums"}}>
                                {formatDelta(row.deltas[team.id])}
                            </Typography>
                        ))}
                    </Box>
                ))}
            </Paper>
            <Button variant="contained" onClick={saveRandomRound} sx={{mt: 2}}>Spara ny omgång (demo)</Button>

            <Slide direction="up" in={!!toastFor} mountOnEnter unmountOnExit>
                <Box sx={{position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center"}}>
                    {toastFor && (
                        <Toast key={toastFor.round} round={toastFor} teams={teams} onUndo={undo} onClose={() => setToastFor(null)}/>
                    )}
                </Box>
            </Slide>
        </Box>
    );
}
