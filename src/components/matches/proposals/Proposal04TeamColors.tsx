"use client";

import Link from "next/link";
import {Avatar, AvatarGroup, Box, Card, CardActionArea, CardContent, Typography} from "@mui/material";
import {getMatchCardData, ProposalProps} from "./matchCardData";

const initials = (name: string) => name.split(/[+\s]/).map(part => part[0]).join("").slice(0, 2).toUpperCase();

/** Förslag 4: Lagfärger & avatarer — spelarnas färger används för avatarer och en färgad kant för vinnaren. */
export default function Proposal04TeamColors(props: ProposalProps) {
    const data = getMatchCardData(props);
    const winner = data.teams[0];

    return (
        <Card sx={{borderLeft: `6px solid ${winner.color}`}}>
            <CardActionArea component={Link} href={`/match/${props.match.GAME_ID}`}>
                <CardContent>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Box>
                            <Typography variant="h6">#{props.index} {data.name}</Typography>
                            <Typography variant="body2">{data.dateLabel}</Typography>
                        </Box>
                        <AvatarGroup max={4}>
                            {data.teams.map(team => (
                                <Avatar key={team.teamId} sx={{bgcolor: team.color, width: 32, height: 32, fontSize: 13}}>
                                    {initials(team.name)}
                                </Avatar>
                            ))}
                        </AvatarGroup>
                    </Box>
                    <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mt: 2}}>
                        {data.teams.map(team => (
                            <Box key={team.teamId} sx={{
                                display: "flex", alignItems: "center", gap: 1, p: 1, borderRadius: 2,
                                bgcolor: `color-mix(in srgb, ${team.color} 12%, white)`,
                            }}>
                                <Avatar sx={{bgcolor: team.color, width: 28, height: 28, fontSize: 12}}>{team.rank}</Avatar>
                                <Typography sx={{flex: 1, fontWeight: 700, color: "text.primary"}} noWrap>{team.name}</Typography>
                                <Typography sx={{fontVariantNumeric: "tabular-nums"}}>{team.score}</Typography>
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
