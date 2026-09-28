"use client";

import Link from "next/link";
import {Box, Card, CardActionArea, CardContent, Typography} from "@mui/material";
import {getMatchCardData, ProposalProps} from "./matchCardData";

const WIDTH = 240;
const HEIGHT = 90;

/** Förslag 3: Minigraf — poängutvecklingen per omgång ritas som en liten linjegraf. */
export default function Proposal03Sparkline(props: ProposalProps) {
    const data = getMatchCardData(props);
    const all = data.teams.flatMap(team => team.history);
    const min = Math.min(...all);
    const max = Math.max(...all);
    const steps = Math.max(1, data.rounds);
    const x = (i: number) => (i / steps) * WIDTH;
    const y = (v: number) => HEIGHT - 4 - ((v - min) / Math.max(1, max - min)) * (HEIGHT - 8);

    return (
        <Card>
            <CardActionArea component={Link} href={`/match/${props.match.GAME_ID}`}>
                <CardContent>
                    <Typography variant="h6">#{props.index} {data.name}</Typography>
                    <Typography variant="body2">{data.dateLabel} · {data.rounds} omgångar</Typography>
                    <Box sx={{display: "flex", gap: 2, mt: 2, alignItems: "center"}}>
                        <Box component="svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} sx={{flex: 1, height: HEIGHT, minWidth: 0}}
                             preserveAspectRatio="none" role="img" aria-label="Poängutveckling">
                            <line x1={0} x2={WIDTH} y1={y(500)} y2={y(500)} stroke="#ddd" strokeDasharray="3 3"/>
                            {data.teams.map(team => (
                                <polyline key={team.teamId} fill="none" stroke={team.color} strokeWidth={team.rank === 1 ? 3 : 1.5}
                                          vectorEffect="non-scaling-stroke" strokeLinejoin="round"
                                          points={team.history.map((v, i) => `${x(i)},${y(v)}`).join(" ")}/>
                            ))}
                        </Box>
                        <Box sx={{minWidth: 120}}>
                            {data.teams.map(team => (
                                <Box key={team.teamId} sx={{display: "flex", alignItems: "center", gap: 1}}>
                                    <Box sx={{width: 10, height: 10, borderRadius: "50%", bgcolor: team.color}}/>
                                    <Typography variant="body2" sx={{flex: 1, color: "text.primary", fontWeight: team.rank === 1 ? 700 : 400}} noWrap>
                                        {team.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{fontVariantNumeric: "tabular-nums"}}>{team.score}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
