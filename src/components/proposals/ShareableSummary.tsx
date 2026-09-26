"use client";

import React, {useState} from "react";
import {Box, Button, Typography} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {ProposalTeamScore, TeamAvatar} from "@/components/proposals/shared";

export interface SummaryHighlight {
    icon: string;
    label: string;
    value: string;
}

interface Props {
    readonly matchName: string;
    readonly date: string;
    readonly rounds: number;
    readonly teams: ProposalTeamScore[];
    readonly highlights: SummaryHighlight[];
}

const PODIUM = [
    {place: 2, height: 70, color: "#C9C9D0"},
    {place: 1, height: 100, color: "#E8C23A"},
    {place: 3, height: 50, color: "#C98B55"},
];

/**
 * Förslag 10: A summary card of a finished match that looks good when shared
 * in the group chat, with a podium and the highlights of the evening.
 */
export default function ShareableSummary({matchName, date, rounds, teams, highlights}: Props) {
    const [copied, setCopied] = useState(false);
    const sorted = [...teams].sort((a, b) => b.score - a.score);

    const text = [
        `🀄 ${matchName} (${date})`,
        ...sorted.map((team, index) => `${["🥇", "🥈", "🥉", "4."][index]} ${team.name} ${team.score}`),
        ...highlights.map((highlight) => `${highlight.icon} ${highlight.label}: ${highlight.value}`),
    ].join("\n");

    const share = async () => {
        if (navigator.share) {
            await navigator.share({title: matchName, text}).catch(() => undefined);
        } else {
            await navigator.clipboard?.writeText(text);
            setCopied(true);
        }
    };

    return (
        <Box sx={{maxWidth: 420}}>
            <Box
                sx={{
                    aspectRatio: "4 / 5", borderRadius: 4, p: 3, color: "white", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
                    background: "linear-gradient(160deg, #3B1414 0%, #943030 55%, #E54646 100%)",
                }}
            >
                <Typography sx={{color: "rgba(255,255,255,0.7)", fontSize: 12, letterSpacing: 2, textTransform: "uppercase"}}>
                    Mahjong Master System
                </Typography>
                <Typography sx={{color: "white", fontSize: 28, fontWeight: 800, lineHeight: 1.1, mt: 0.5}}>{matchName}</Typography>
                <Typography sx={{color: "rgba(255,255,255,0.8)", fontSize: 14}}>{date} · {rounds} omgångar</Typography>

                <Box sx={{display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 1, mt: "auto", mb: 1}}>
                    {PODIUM.map(({place, height, color}) => {
                        const team = sorted[place - 1];
                        return (
                            <Box key={place} sx={{flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5}}>
                                {place === 1 && <Typography sx={{fontSize: 22, lineHeight: 1}}>👑</Typography>}
                                <TeamAvatar team={team} size={place === 1 ? 56 : 44} sx={{border: "3px solid white"}}/>
                                <Typography sx={{color: "white", fontWeight: 700, fontSize: 14}} noWrap>{team.name}</Typography>
                                <Typography sx={{color: "rgba(255,255,255,0.85)", fontSize: 13}}>{team.score}</Typography>
                                <Box
                                    sx={{
                                        width: "100%", height, borderRadius: "8px 8px 0 0", backgroundColor: color,
                                        display: "flex", alignItems: "flex-start", justifyContent: "center", pt: 0.5,
                                        fontWeight: 800, fontSize: 22, color: "rgba(0,0,0,0.35)",
                                    }}
                                >
                                    {place}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
                <Typography sx={{color: "rgba(255,255,255,0.75)", fontSize: 13, textAlign: "center"}}>
                    4. {sorted[3].name} · {sorted[3].score}
                </Typography>

                <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mt: 2}}>
                    {highlights.map((highlight) => (
                        <Box key={highlight.label} sx={{p: 1, borderRadius: 2, backgroundColor: "rgba(0,0,0,0.2)"}}>
                            <Typography sx={{color: "rgba(255,255,255,0.7)", fontSize: 11}}>{highlight.icon} {highlight.label}</Typography>
                            <Typography sx={{color: "white", fontSize: 14, fontWeight: 700}}>{highlight.value}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box sx={{display: "flex", gap: 1, mt: 1.5}}>
                <Button variant="contained" startIcon={<ShareIcon/>} onClick={share} sx={{flex: 1}}>Dela</Button>
                <Button
                    startIcon={<ContentCopyIcon/>}
                    onClick={() => navigator.clipboard?.writeText(text).then(() => setCopied(true))}
                    sx={{flex: 1, backgroundColor: "#eee", color: "#606060"}}
                >
                    {copied ? "Kopierat!" : "Kopiera text"}
                </Button>
            </Box>
        </Box>
    );
}
