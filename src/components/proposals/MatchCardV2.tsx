"use client";

import React from "react";
import {Box, Card, CardActionArea, Chip, Typography} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import {ProposalTeamScore, Sparklines, STARTING_SCORE, TeamAvatar} from "@/components/proposals/shared";

export interface MatchCardData {
    index: number;
    name: string;
    date: string;
    timeRange: string;
    rounds: number;
    comment?: string;
    active?: boolean;
    badges?: string[];
    teams: ProposalTeamScore[];
}

/**
 * Förslag 3: A more visual match card. The winner is highlighted, every team
 * gets a bar showing how far above or below 500 it ended and a small chart
 * shows how the match went.
 */
export default function MatchCardV2({match}: { readonly match: MatchCardData }) {
    const sorted = [...match.teams].sort((a, b) => b.score - a.score);
    const maxDistance = Math.max(...sorted.map((team) => Math.abs(team.score - STARTING_SCORE)), 1);
    const [winner, ...rest] = sorted;

    return (
        <Card elevation={0} sx={{borderRadius: 3, border: "1px solid #eee", maxWidth: 520, backgroundColor: "white"}}>
            <CardActionArea sx={{p: 2}}>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2}}>
                    <Box>
                        <Typography variant="body2" sx={{fontSize: 12, textTransform: "uppercase", letterSpacing: 1}}>
                            Match #{match.index}
                        </Typography>
                        <Typography variant="h2" sx={{fontSize: 20, mt: 0.25}}>{match.name}</Typography>
                    </Box>
                    <Box sx={{textAlign: "right"}}>
                        {match.active && <Chip size="small" color="primary" label="● Pågår" sx={{mb: 0.5}}/>}
                        <Sparklines teams={match.teams} width={110} height={34}/>
                    </Box>
                </Box>
                <Typography variant="body2" sx={{mt: 0.5}}>
                    <AccessTimeIcon sx={{fontSize: 14, verticalAlign: "-2px", mr: 0.5}}/>{match.date} · {match.timeRange} · {match.rounds} omgångar
                </Typography>

                <Box
                    sx={{
                        mt: 2, p: 1.5, borderRadius: 2, display: "flex", alignItems: "center", gap: 1.5,
                        background: "linear-gradient(90deg, #FFF6D6, #FFFDF5)", border: "1px solid #F3E2A0",
                    }}
                >
                    <TeamAvatar team={winner} size={44} sx={{boxShadow: "0 0 0 3px #E0B000"}}/>
                    <Box sx={{flexGrow: 1}}>
                        <Typography variant="body2" sx={{fontSize: 12, color: "#9A7B00"}}>
                            {match.active ? "Leder" : "Vinnare"}
                        </Typography>
                        <Typography sx={{fontWeight: 700, fontSize: 18}}>{winner.name}</Typography>
                    </Box>
                    <EmojiEventsIcon sx={{color: "#E0B000"}}/>
                    <Typography sx={{fontWeight: 800, fontSize: 26, fontVariantNumeric: "tabular-nums"}}>{winner.score}</Typography>
                </Box>

                <Box sx={{mt: 1.5, display: "grid", gap: 1}}>
                    {rest.map((team, index) => {
                        const distance = team.score - STARTING_SCORE;
                        const width = (Math.abs(distance) / maxDistance) * 50;
                        return (
                            <Box key={team.id} sx={{display: "grid", gridTemplateColumns: "20px 26px 1fr 1.2fr 48px", alignItems: "center", gap: 1}}>
                                <Typography variant="body2" sx={{fontWeight: 700}}>{index + 2}</Typography>
                                <TeamAvatar team={team} size={26}/>
                                <Typography variant="body1" noWrap>{team.name}</Typography>
                                <Box sx={{position: "relative", height: 8, borderRadius: 4, backgroundColor: "#f1f1f1"}}>
                                    <Box sx={{position: "absolute", left: "50%", top: -3, bottom: -3, width: "1px", backgroundColor: "#ccc"}}/>
                                    <Box
                                        sx={{
                                            position: "absolute", top: 0, bottom: 0, borderRadius: 4, backgroundColor: team.color,
                                            left: distance >= 0 ? "50%" : `${50 - width}%`, width: `${width}%`,
                                        }}
                                    />
                                </Box>
                                <Typography sx={{fontWeight: 700, textAlign: "right", fontVariantNumeric: "tabular-nums"}}>{team.score}</Typography>
                            </Box>
                        );
                    })}
                </Box>

                {(match.comment || match.badges?.length) && (
                    <Box sx={{mt: 1.5, display: "flex", gap: 0.75, flexWrap: "wrap", alignItems: "center"}}>
                        {match.badges?.map((badge) => (
                            <Chip key={badge} size="small" variant="outlined" color="error" icon={<LocalFireDepartmentIcon/>} label={badge}/>
                        ))}
                        {match.comment && <Typography variant="body2" sx={{fontStyle: "italic"}}>“{match.comment}”</Typography>}
                    </Box>
                )}
            </CardActionArea>
        </Card>
    );
}
