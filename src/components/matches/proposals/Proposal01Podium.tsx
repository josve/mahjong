"use client";

import Link from "next/link";
import {Box, Card, CardActionArea, CardContent, Typography} from "@mui/material";
import {getMatchCardData, ProposalProps} from "./matchCardData";

const MEDALS = ["🥇", "🥈", "🥉"];
const PODIUM_HEIGHTS = [72, 52, 36];
// Silver to the left, gold in the middle, bronze to the right.
const PODIUM_ORDER = [1, 0, 2];

/** Förslag 1: Pallplacering — topp tre visas som en prispall, fjärde plats under. */
export default function Proposal01Podium(props: ProposalProps) {
    const data = getMatchCardData(props);
    const fourth = data.teams[3];

    return (
        <Card>
            <CardActionArea component={Link} href={`/match/${props.match.GAME_ID}`}>
                <CardContent>
                    <Typography variant="h6">#{props.index} {data.name}</Typography>
                    <Typography variant="body2">{data.dateLabel} · {data.rounds} omgångar</Typography>

                    <Box sx={{display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 1, mt: 2}}>
                        {PODIUM_ORDER.map(position => {
                            const team = data.teams[position];
                            return (
                                <Box key={team.teamId} sx={{flex: 1, textAlign: "center", maxWidth: 140}}>
                                    <Typography sx={{fontSize: 28}}>{MEDALS[position]}</Typography>
                                    <Typography sx={{fontWeight: 700, color: "text.primary"}} noWrap>{team.name}</Typography>
                                    <Typography variant="body2">{team.score}</Typography>
                                    <Box sx={{
                                        height: PODIUM_HEIGHTS[position],
                                        mt: 0.5,
                                        borderRadius: "6px 6px 0 0",
                                        background: position === 0
                                            ? "linear-gradient(180deg, #f5d36b, #d4a52c)"
                                            : position === 1
                                                ? "linear-gradient(180deg, #e3e3e3, #b8b8b8)"
                                                : "linear-gradient(180deg, #e9b48a, #b9794a)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "#fff", fontWeight: 700, fontSize: 22,
                                    }}>
                                        {position + 1}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                    <Typography variant="body2" sx={{textAlign: "center", mt: 1}}>
                        4. {fourth.name} · {fourth.score}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
