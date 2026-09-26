"use client";

import React from "react";
import {Box, Paper, Tooltip, Typography} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import {ProposalTeam, STARTING_SCORE, TeamAvatar} from "@/components/proposals/shared";

export interface PlayerResult {
    matchName: string;
    date: string;
    /** 1 = won the match. */
    placement: number;
    score: number;
}

interface Props {
    readonly player: ProposalTeam;
    /** Latest results, oldest first. */
    readonly results: PlayerResult[];
    readonly rank: number;
    readonly previousRank: number;
    readonly mahjongs: number;
    readonly rounds: number;
}

const PLACEMENT_COLORS = ["#E0B000", "#A7A7AD", "#B87333", "#D6D6D6"];

/**
 * Förslag 8: "Min form" – a personal summary for the logged in player on the
 * start page or the profile page.
 */
export default function PlayerFormCard({player, results, rank, previousRank, mahjongs, rounds}: Props) {
    const wins = results.filter((result) => result.placement === 1).length;
    const average = Math.round(results.reduce((sum, result) => sum + result.score, 0) / Math.max(results.length, 1));
    let streak = 0;
    for (let i = results.length - 1; i >= 0 && results[i].placement === 1; i--) streak++;
    const maxDistance = Math.max(...results.map((result) => Math.abs(result.score - STARTING_SCORE)), 1);
    const rankChange = previousRank - rank;

    const stats: [string, string][] = [
        ["Vinstprocent", `${Math.round((wins / Math.max(results.length, 1)) * 100)} %`],
        ["Snittpoäng", String(average)],
        ["Mahjong", `${Math.round((mahjongs / Math.max(rounds, 1)) * 100)} %`],
    ];

    return (
        <Paper elevation={0} sx={{p: 2, borderRadius: 3, border: "1px solid #eee", maxWidth: 520, backgroundColor: "white"}}>
            <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
                <TeamAvatar team={player} size={52}/>
                <Box sx={{flexGrow: 1}}>
                    <Typography variant="body2" sx={{fontSize: 12, textTransform: "uppercase", letterSpacing: 1}}>Min form</Typography>
                    <Typography variant="h2" sx={{fontSize: 22}}>{player.name}</Typography>
                </Box>
                <Box sx={{textAlign: "right"}}>
                    <Typography sx={{fontSize: 28, fontWeight: 800, lineHeight: 1, color: "primary.main"}}>#{rank}</Typography>
                    <Typography
                        variant="body2"
                        sx={{display: "flex", alignItems: "center", gap: 0.25, justifyContent: "flex-end", fontSize: 12, color: rankChange > 0 ? "#2E7D32" : rankChange < 0 ? "error.main" : undefined}}
                    >
                        {rankChange > 0 && <TrendingUpIcon sx={{fontSize: 16}}/>}
                        {rankChange < 0 && <TrendingDownIcon sx={{fontSize: 16}}/>}
                        {rankChange === 0 ? "Samma placering" : `${Math.abs(rankChange)} placering${Math.abs(rankChange) > 1 ? "ar" : ""}`}
                    </Typography>
                </Box>
            </Box>

            {streak >= 2 && (
                <Box sx={{mt: 1.5, px: 1.5, py: 0.75, borderRadius: 2, backgroundColor: "#FFF1E6", display: "flex", alignItems: "center", gap: 1}}>
                    <LocalFireDepartmentIcon sx={{color: "#E65100"}}/>
                    <Typography sx={{fontSize: 14, color: "#8A3A00", fontWeight: 700}}>{streak} vinster i rad!</Typography>
                </Box>
            )}

            <Typography variant="body2" sx={{mt: 2, mb: 1}}>Senaste {results.length} matcherna</Typography>
            <Box sx={{display: "flex", alignItems: "center", height: 90, gap: 0.75}}>
                {results.map((result, index) => {
                    const distance = result.score - STARTING_SCORE;
                    const height = (Math.abs(distance) / maxDistance) * 40;
                    return (
                        <Tooltip key={index} title={`${result.matchName} ${result.date}: ${result.score} p, plats ${result.placement}`}>
                            <Box sx={{flex: 1, height: "100%", position: "relative"}}>
                                <Box sx={{position: "absolute", left: 0, right: 0, top: "50%", height: "1px", backgroundColor: "#e5e5e5"}}/>
                                <Box
                                    sx={{
                                        position: "absolute", left: "15%", right: "15%", borderRadius: 1,
                                        backgroundColor: distance >= 0 ? player.color : "#E0B4B4",
                                        ...(distance >= 0 ? {bottom: "50%"} : {top: "50%"}), height: `${height}px`,
                                    }}
                                />
                            </Box>
                        </Tooltip>
                    );
                })}
            </Box>
            <Box sx={{display: "flex", gap: 0.75, mt: 0.5}}>
                {results.map((result, index) => (
                    <Box
                        key={index}
                        sx={{
                            flex: 1, height: 24, borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 700, backgroundColor: PLACEMENT_COLORS[result.placement - 1],
                            color: result.placement <= 3 ? "white" : "#777",
                        }}
                    >
                        {result.placement}
                    </Box>
                ))}
            </Box>

            <Box sx={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, mt: 2}}>
                {stats.map(([label, value]) => (
                    <Box key={label} sx={{p: 1, borderRadius: 2, backgroundColor: "#fafafa", textAlign: "center"}}>
                        <Typography sx={{fontSize: 20, fontWeight: 800}}>{value}</Typography>
                        <Typography variant="body2" sx={{fontSize: 12}}>{label}</Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}
