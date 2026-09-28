"use client";

import Link from "next/link";
import {Box, Card, CardActionArea, Typography} from "@mui/material";
import {formatDelta, getMatchCardData, ProposalProps} from "./matchCardData";

/** Förslag 5: Kompakt rad — en tät tabellrad som gör det lätt att skumma många matcher, särskilt i mobilen. */
export default function Proposal05Compact(props: ProposalProps) {
    const data = getMatchCardData(props);

    return (
        <Card variant="outlined">
            <CardActionArea component={Link} href={`/match/${props.match.GAME_ID}`}
                            sx={{display: "grid", gridTemplateColumns: "44px 1fr", alignItems: "stretch"}}>
                <Box sx={{bgcolor: "primary.main", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 15}}>
                    {props.index}
                </Box>
                <Box sx={{p: 1.25}}>
                    <Box sx={{display: "flex", justifyContent: "space-between", gap: 1}}>
                        <Typography sx={{fontWeight: 700, color: "primary.main"}} noWrap>{data.name}</Typography>
                        <Typography variant="body2" noWrap>{props.match.TIME.toLocaleDateString("sv-SE")} · {data.rounds} omg</Typography>
                    </Box>
                    <Box component="table" sx={{width: "100%", borderCollapse: "collapse", mt: 0.5,
                        "& td": {py: 0.25, fontSize: 13, fontVariantNumeric: "tabular-nums"}}}>
                        <tbody>
                        {data.teams.map(team => (
                            <tr key={team.teamId}>
                                <Box component="td" sx={{width: 18, color: "text.secondary"}}>{team.rank}</Box>
                                <Box component="td" sx={{color: "text.primary", fontWeight: team.rank === 1 ? 700 : 400}}>{team.name}</Box>
                                <Box component="td" sx={{textAlign: "right", width: 48}}>{team.score}</Box>
                                <Box component="td" sx={{textAlign: "right", width: 52, color: team.delta >= 0 ? "#2e8a48" : "#c43a3a"}}>
                                    {formatDelta(team.delta)}
                                </Box>
                            </tr>
                        ))}
                        </tbody>
                    </Box>
                </Box>
            </CardActionArea>
        </Card>
    );
}
