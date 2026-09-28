"use client";

import Link from "next/link";
import {Box, Card, CardActionArea, CardContent, Chip, Divider, Typography} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import RepeatIcon from "@mui/icons-material/Repeat";
import StarIcon from "@mui/icons-material/Star";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import LocalFireDepartment from "@mui/icons-material/LocalFireDepartment";
import {formatDuration, getMatchCardData, ProposalProps} from "./matchCardData";

/** Förslag 9: Nyckeltal — en fast statistikrad (tid, omgångar, största hand, marginal) och märken i ett eget fält som inte täcker poängen. */
export default function Proposal09StatsFooter(props: ProposalProps) {
    const data = getMatchCardData(props);
    const facts = [
        {icon: <ScheduleIcon fontSize="small"/>, label: "Speltid", value: formatDuration(data.durationMinutes)},
        {icon: <RepeatIcon fontSize="small"/>, label: "Omgångar", value: `${data.rounds}`},
        {icon: <StarIcon fontSize="small"/>, label: "Största hand", value: data.biggestHand ? `${data.biggestHand.hand}` : "–"},
        {icon: <CompareArrowsIcon fontSize="small"/>, label: "Marginal", value: `${data.stats?.finalMargin ?? 0}`},
    ];

    return (
        <Card>
            <CardActionArea component={Link} href={`/match/${props.match.GAME_ID}`}>
                <CardContent sx={{pb: 1}}>
                    <Typography variant="h6">#{props.index} {data.name}</Typography>
                    <Typography variant="body2">{data.dateLabel} ({data.timeRange})</Typography>
                    <Box sx={{mt: 1.5}}>
                        {data.teams.map(team => (
                            <Box key={team.teamId} sx={{display: "flex", justifyContent: "space-between", py: 0.25}}>
                                <Typography sx={{color: "text.primary", fontWeight: team.rank === 1 ? 700 : 400}}>{team.rank}. {team.name}</Typography>
                                <Typography sx={{fontVariantNumeric: "tabular-nums"}}>{team.score}</Typography>
                            </Box>
                        ))}
                    </Box>
                </CardContent>
                <Divider/>
                <Box sx={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", bgcolor: "#fafafa"}}>
                    {facts.map(fact => (
                        <Box key={fact.label} sx={{p: 1, textAlign: "center", color: "text.secondary"}}>
                            {fact.icon}
                            <Typography sx={{fontWeight: 700, color: "text.primary", fontSize: 15}}>{fact.value}</Typography>
                            <Typography sx={{fontSize: 11}}>{fact.label}</Typography>
                        </Box>
                    ))}
                </Box>
                {data.hasLimitHand && (
                    <Box sx={{px: 2, py: 1, borderTop: "1px solid #eee"}}>
                        <Chip size="small" color="error" icon={<LocalFireDepartment/>} label="Limit hand"/>
                    </Box>
                )}
            </CardActionArea>
        </Card>
    );
}
