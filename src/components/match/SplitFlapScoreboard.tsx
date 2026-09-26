"use client";

import React from "react";
import {AnimatePresence, motion} from "motion/react";
import {useMediaQuery} from "@mui/material";
import {Hand, IdToColorMap, IdToName} from "@/types/db";

const STARTING_SCORE = 500;

export interface ScoreboardTeam {
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
export function scoreboardTeams(hands: Hand[], teamIdToName: IdToName, teamColors: IdToColorMap): ScoreboardTeam[] {
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

function Flap({char, width, delay = 0}: { readonly char: string; readonly width: number; readonly delay?: number }) {
    return (
        <span style={{
            position: "relative",
            display: "inline-block",
            width,
            height: width * 1.45,
            margin: "0 1.5px",
            perspective: 200,
            background: "linear-gradient(#fafafa, #ececec)",
            borderRadius: 4,
            boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.15)",
            overflow: "hidden",
            verticalAlign: "middle",
        }}>
            <AnimatePresence initial={false}>
                <motion.span
                    key={char}
                    initial={{rotateX: -90, opacity: 0.4}}
                    animate={{rotateX: 0, opacity: 1}}
                    exit={{rotateX: 90, opacity: 0}}
                    transition={{duration: 0.35, delay, ease: "easeOut"}}
                    style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#333",
                        fontSize: width * 0.95,
                        fontWeight: 700,
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    }}
                >
                    {char}
                </motion.span>
            </AnimatePresence>
            <span style={{position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "rgba(0,0,0,0.12)"}}/>
        </span>
    );
}

interface Props {
    readonly teams: ScoreboardTeam[];
    /** Number of rounds played so far. */
    readonly round: number;
}

/** The current standings as a mechanical split-flap board where every digit flips when it changes. */
export default function SplitFlapScoreboard({teams, round}: Props) {
    const small = useMediaQuery("(max-width:500px)");
    const flapWidth = small ? 22 : 30;
    const rows = [...teams].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

    return (
        <div style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 10,
            padding: small ? "10px 10px" : "14px 16px",
            margin: "16px 0",
            color: "#444",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            overflowX: "auto",
        }}>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12, letterSpacing: "0.2em", color: "var(--header-color)"}}>
                <span>STÄLLNING</span>
                <span>{round > 0 ? `OMGÅNG ${round}` : "START"}</span>
            </div>
            {rows.map((team, index) => (
                <motion.div
                    layout
                    key={team.id}
                    transition={{type: "spring", stiffness: 200, damping: 25}}
                    style={{display: "flex", alignItems: "center", gap: small ? 6 : 10, padding: "4px 0"}}
                >
                    <Flap char={String(index + 1)} width={small ? 16 : 22}/>
                    <span style={{width: 6, height: flapWidth, borderRadius: 2, background: team.color, flexShrink: 0}}/>
                    <span style={{
                        flex: 1, minWidth: 0, fontSize: small ? 14 : 18, fontWeight: 600, letterSpacing: "0.08em",
                        textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                        {team.name}
                    </span>
                    <span style={{whiteSpace: "nowrap"}}>
                        {String(team.score).padStart(4, " ").split("").map((char, i) => (
                            <Flap key={i} char={char} width={flapWidth} delay={i * 0.07}/>
                        ))}
                    </span>
                    <span style={{
                        width: small ? 40 : 52, textAlign: "right", fontSize: small ? 12 : 14, fontWeight: 700, flexShrink: 0,
                        color: team.delta > 0 ? "#2e7d32" : team.delta < 0 ? "#c62828" : "#999",
                    }}>
                        {round > 0 ? formatDelta(team.delta) : ""}
                    </span>
                </motion.div>
            ))}
        </div>
    );
}
