"use client";

import React from "react";
import {motion} from "motion/react";
import {abbreviate, ranked, ScoreboardProps, useCountUp} from "./shared";

const RANK_LABELS = ["1ST", "2ND", "3RD", "4TH"];
const RANK_COLORS = ["#ffe600", "#00e5ff", "#ff4df0", "#7cff4d"];
const FONT = "'Press Start 2P', 'Courier New', ui-monospace, monospace";

function PaddedScore({value}: { readonly value: number }) {
    const display = useCountUp(value, 0.6);
    const sign = display < 0 ? "-" : "";
    return <>{sign}{String(Math.abs(display)).padStart(6, "0")}</>;
}

/** 10. Arcade – an 80s high score table with CRT scanlines and blinking text. */
export default function ArcadeScoreboard({teams, round, finished}: ScoreboardProps) {
    const order = ranked(teams);

    return (
        <div style={{
            position: "relative", overflow: "hidden",
            background: "#000", borderRadius: 18, padding: "18px 20px",
            fontFamily: FONT, color: "#fff",
            boxShadow: "inset 0 0 50px rgba(80,120,255,0.35), 0 8px 20px rgba(0,0,0,0.4)",
        }}>
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 3px)",
            }}/>
            <motion.div
                animate={{color: RANK_COLORS.concat(RANK_COLORS[0])}}
                transition={{repeat: Infinity, duration: 2, ease: "linear"}}
                style={{textAlign: "center", fontSize: 22, fontWeight: 900, letterSpacing: "0.15em", marginBottom: 14}}
            >
                HIGH SCORES
            </motion.div>
            {order.map((team, index) => (
                <motion.div
                    key={team.id}
                    layout
                    transition={{type: "spring", stiffness: 500, damping: 35}}
                    style={{
                        display: "grid", gridTemplateColumns: "50px 18px 1fr auto", gap: 12, alignItems: "center",
                        padding: "5px 0", color: RANK_COLORS[index], fontSize: 18, fontWeight: 700,
                        textShadow: `0 0 6px ${RANK_COLORS[index]}`,
                    }}
                >
                    <span>{RANK_LABELS[index]}</span>
                    <span style={{width: 14, height: 14, background: team.color, boxShadow: `0 0 6px ${team.color}`}}/>
                    <span style={{letterSpacing: "0.15em"}}>{abbreviate(team.name)}</span>
                    <span style={{fontVariantNumeric: "tabular-nums", letterSpacing: "0.08em"}}><PaddedScore value={team.score}/></span>
                </motion.div>
            ))}
            <motion.div
                animate={{opacity: [1, 1, 0, 0]}}
                transition={{repeat: Infinity, duration: 1, times: [0, 0.5, 0.5, 1]}}
                style={{textAlign: "center", marginTop: 14, fontSize: 14, color: finished ? "#ff3b3b" : "#fff", letterSpacing: "0.2em"}}
            >
                {finished ? "GAME OVER" : `ROUND ${round}  ·  PRESS START`}
            </motion.div>
        </div>
    );
}
