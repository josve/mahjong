"use client";

import React from "react";
import {Box, Card, CardContent, Typography} from "@mui/material";
import {motion} from "motion/react";
import {Hand, IdToColorMap, IdToName} from "@/types/db";
import {useTranslations} from "next-intl";

const STARTING_SCORE = 500;

export interface StandingsTeam {
    id: string;
    name: string;
    /** CSS color, e.g. "rgb(229, 70, 70)". */
    color: string;
    /** Total score after the latest round. */
    score: number;
    /** Score change in the latest round. */
    delta: number;
}

/** Each team's total score and latest change, in seat order. */
export function standingsTeams(hands: Hand[], teamIdToName: IdToName, teamColors: IdToColorMap): StandingsTeam[] {
    const round = Math.max(0, ...hands.map((hand) => hand.ROUND));
    const teamIds = [...new Set(hands.map((hand) => hand.TEAM_ID))];
    return teamIds.map((id) => {
        const teamHands = hands.filter((hand) => hand.TEAM_ID === id);
        const color = teamColors[id];
        return {
            id,
            name: teamIdToName[id] ?? id,
            color: color ? `rgb(${color.color_red}, ${color.color_green}, ${color.color_blue})` : "#888",
            score: STARTING_SCORE + teamHands.reduce((sum, hand) => sum + hand.HAND_SCORE, 0),
            delta: teamHands.find((hand) => hand.ROUND === round)?.HAND_SCORE ?? 0,
        };
    });
}

function formatDelta(delta: number): string {
    if (delta > 0) return `+${delta}`;
    if (delta < 0) return `−${Math.abs(delta)}`;
    return "±0";
}

function deltaColor(delta: number): string {
    if (delta > 0) return "#2e7d32";
    if (delta < 0) return "error.main";
    return "text.secondary";
}

interface Props {
    readonly teams: StandingsTeam[];
    /** Number of rounds played so far. */
    readonly round: number;
}

/** The current standings of a match as a card, leader first. Rows slide into place when the order changes. */
export default function MatchStandings({teams, round}: Props) {
    const t = useTranslations("match");
    const rows = [...teams].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

    return (
        <Card sx={{my: 2}}>
            <CardContent>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5}}>
                    <Typography variant="h6" component="h2">{t("standings")}</Typography>
                    <Typography variant="body2" color="primary">
                        {round > 0 ? t("roundNumber", {round}) : t("start")}
                    </Typography>
                </Box>
                {rows.map((team, index) => (
                    <motion.div layout key={team.id} transition={{type: "spring", stiffness: 200, damping: 25}}>
                        <Box sx={{
                            display: "flex", alignItems: "center", gap: 1.5, py: 1,
                            borderTop: index === 0 ? "none" : "1px solid #f0f0f0",
                        }}>
                            <Typography variant="body2" sx={{width: 16, textAlign: "right", flexShrink: 0}}>
                                {index + 1}
                            </Typography>
                            <Box component="span" sx={{width: 12, height: 12, borderRadius: "50%", bgcolor: team.color, flexShrink: 0}}/>
                            <Typography variant="body1" sx={{
                                flex: 1, minWidth: 0, fontSize: 18, fontWeight: index === 0 ? 700 : 400,
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                                {team.name}
                            </Typography>
                            <Typography variant="body1" sx={{fontSize: 22, fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>
                                {team.score}
                            </Typography>
                            <Typography variant="body2" sx={{width: 48, textAlign: "right", fontWeight: 700, flexShrink: 0, color: deltaColor(team.delta)}}>
                                {round > 0 ? formatDelta(team.delta) : ""}
                            </Typography>
                        </Box>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
}
