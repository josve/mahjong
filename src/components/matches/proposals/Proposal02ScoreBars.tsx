"use client";

import Link from "next/link";
import {Box, Card, CardActionArea, CardContent, Typography} from "@mui/material";
import {formatDelta, getMatchCardData, ProposalProps} from "./matchCardData";

/** Förslag 2: Poängstaplar — varje lags +/- mot startpoängen som en divergerande stapel. */
export default function Proposal02ScoreBars(props: ProposalProps) {
    const data = getMatchCardData(props);
    const maxAbs = Math.max(1, ...data.teams.map(team => Math.abs(team.delta)));

    return (
        <Card>
            <CardActionArea component={Link} href={`/match/${props.match.GAME_ID}`}>
                <CardContent>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
                        <Typography variant="h6">#{props.index} {data.name}</Typography>
                        <Typography variant="body2" color="primary">{data.rounds} omgångar</Typography>
                    </Box>
                    <Typography variant="body2" sx={{mb: 2}}>{data.dateLabel} ({data.timeRange})</Typography>

                    {data.teams.map(team => {
                        const width = `${(Math.abs(team.delta) / maxAbs) * 50}%`;
                        const positive = team.delta >= 0;
                        return (
                            <Box key={team.teamId} sx={{display: "grid", gridTemplateColumns: "96px 1fr 56px", alignItems: "center", gap: 1, mb: 1}}>
                                <Typography sx={{fontWeight: 700, color: "text.primary"}} noWrap>{team.name}</Typography>
                                <Box sx={{position: "relative", height: 14, bgcolor: "#f1f1f1", borderRadius: 7}}>
                                    <Box sx={{position: "absolute", left: "50%", top: -3, bottom: -3, width: "1px", bgcolor: "#c8c8c8"}}/>
                                    <Box sx={{
                                        position: "absolute", top: 0, bottom: 0, width,
                                        left: positive ? "50%" : undefined,
                                        right: positive ? undefined : "50%",
                                        borderRadius: 7,
                                        bgcolor: positive ? "#3caa5a" : "#e54646",
                                    }}/>
                                </Box>
                                <Typography sx={{textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700,
                                    color: positive ? "#2e8a48" : "#c43a3a"}}>
                                    {formatDelta(team.delta)}
                                </Typography>
                            </Box>
                        );
                    })}
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
