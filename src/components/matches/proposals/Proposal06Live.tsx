"use client";

import Link from "next/link";
import {Box, Card, CardActionArea, CardContent, Chip, Typography} from "@mui/material";
import {keyframes} from "@mui/system";
import {getMatchCardData, ProposalProps, WIND_KANJI} from "./matchCardData";

const pulse = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(229, 70, 70, 0.6); }
    70% { box-shadow: 0 0 0 8px rgba(229, 70, 70, 0); }
    100% { box-shadow: 0 0 0 0 rgba(229, 70, 70, 0); }
`;

/** Förslag 6: Live-läge — pågående matcher får pulserande LIVE-markering, aktuell omgång och vem som sitter öst. */
export default function Proposal06Live(props: ProposalProps) {
    const data = getMatchCardData(props);
    const east = data.teams.find(team => team.wind === "E");
    const leader = data.teams[0];

    return (
        <Card sx={{outline: data.active ? "2px solid #e54646" : undefined}}>
            <CardActionArea component={Link} href={`/match/${props.match.GAME_ID}`}>
                <CardContent>
                    <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                        {data.active && (
                            <Box sx={{display: "flex", alignItems: "center", gap: 0.75, px: 1, py: 0.25, borderRadius: 1,
                                bgcolor: "#e54646", color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: 1}}>
                                <Box sx={{width: 8, height: 8, borderRadius: "50%", bgcolor: "#fff", animation: `${pulse} 1.6s infinite`}}/>
                                LIVE
                            </Box>
                        )}
                        <Typography variant="h6" sx={{flex: 1}}>#{props.index} {data.name}</Typography>
                    </Box>
                    <Box sx={{display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap"}}>
                        <Chip size="small" label={`Omgång ${data.rounds + 1} pågår`}/>
                        {east && <Chip size="small" label={`${WIND_KANJI.E} Öst: ${east.name}`} sx={{bgcolor: "#fff4d6"}}/>}
                        <Chip size="small" label={`Startade ${data.timeRange.split("–")[0]}`}/>
                    </Box>
                    <Typography variant="body2" sx={{mt: 1.5}}>
                        <strong style={{color: "#606060"}}>{leader.name}</strong> leder med {leader.score - data.teams[1].score} poäng
                    </Typography>
                    <Box sx={{display: "flex", mt: 1, gap: 0.5}}>
                        {data.teams.map(team => (
                            <Box key={team.teamId} sx={{flex: 1, textAlign: "center", p: 1, borderRadius: 1,
                                bgcolor: team.wind === "E" ? "#fff4d6" : "#f6f6f6"}}>
                                <Typography sx={{fontSize: 18, color: "text.secondary"}}>{WIND_KANJI[team.wind]}</Typography>
                                <Typography variant="body2" sx={{color: "text.primary", fontWeight: 700}} noWrap>{team.name}</Typography>
                                <Typography sx={{fontVariantNumeric: "tabular-nums"}}>{team.score}</Typography>
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
