"use client";

import React, {useState} from "react";
import Link from "next/link";
import {Box, Button, Card, CardContent, Collapse, IconButton, Typography} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {getMatchCardData, ProposalProps} from "./matchCardData";

/** Förslag 10: Expanderbart kort — en kort sammanfattning som kan fällas ut för att visa de senaste omgångarna utan att lämna startsidan. */
export default function Proposal10Expandable({defaultExpanded = false, ...props}: ProposalProps & { defaultExpanded?: boolean }) {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const data = getMatchCardData(props);
    const winner = data.teams[0];
    const lastRounds = [...new Set(props.match.hands.filter(h => h.ROUND > 0).map(h => h.ROUND))].slice(-4).reverse();

    return (
        <Card sx={{transition: "box-shadow .2s, transform .2s", "&:hover": {boxShadow: 6, transform: "translateY(-2px)"}}}>
            <CardContent sx={{pb: 1}}>
                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <Box sx={{flex: 1, minWidth: 0}}>
                        <Typography variant="h6" noWrap>#{props.index} {data.name}</Typography>
                        <Typography variant="body2">
                            {data.dateLabel} · vinnare <strong style={{color: "#606060"}}>{winner.name}</strong> ({winner.score})
                        </Typography>
                    </Box>
                    <IconButton aria-label={expanded ? "Dölj detaljer" : "Visa detaljer"} aria-expanded={expanded}
                                onClick={() => setExpanded(!expanded)}
                                sx={{transform: expanded ? "rotate(180deg)" : "none", transition: "transform .2s"}}>
                        <ExpandMoreIcon/>
                    </IconButton>
                </Box>
            </CardContent>
            <Collapse in={expanded}>
                <Box sx={{px: 2, pb: 2}}>
                    <Box component="table" sx={{width: "100%", borderCollapse: "collapse",
                        "& th, & td": {fontSize: 13, py: 0.5, textAlign: "right", fontVariantNumeric: "tabular-nums"},
                        "& th:first-of-type, & td:first-of-type": {textAlign: "left"},
                        "& thead th": {color: "text.primary", borderBottom: "1px solid #eee"}}}>
                        <thead>
                        <tr>
                            <th>Omg.</th>
                            {data.teams.map(team => <th key={team.teamId}>{team.name}</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {lastRounds.map(round => (
                            <tr key={round}>
                                <Box component="td" sx={{color: "text.secondary"}}>{round}</Box>
                                {data.teams.map(team => {
                                    const hand = props.match.hands.find(h => h.ROUND === round && h.TEAM_ID === team.teamId);
                                    const score = hand?.HAND_SCORE ?? 0;
                                    return (
                                        <Box component="td" key={team.teamId} sx={{
                                            color: score >= 0 ? "#2e8a48" : "#c43a3a", fontWeight: hand?.IS_WINNER ? 700 : 400}}>
                                            {hand?.IS_WINNER ? "★ " : ""}{score > 0 ? `+${score}` : score}
                                        </Box>
                                    );
                                })}
                            </tr>
                        ))}
                        <Box component="tr" sx={{"& td": {borderTop: "1px solid #eee", fontWeight: 700}}}>
                            <td>Totalt</td>
                            {data.teams.map(team => <td key={team.teamId}>{team.score}</td>)}
                        </Box>
                        </tbody>
                    </Box>
                    <Button component={Link} href={`/match/${props.match.GAME_ID}`} size="small" sx={{mt: 1.5, py: 0.75, px: 2}}>
                        Öppna matchen
                    </Button>
                </Box>
            </Collapse>
        </Card>
    );
}
