"use client";

import React from "react";
import {motion} from "motion/react";
import {abbreviate, CountUp, formatDelta, previousRank, ranked, ScoreboardProps} from "./shared";

/** 5. Timing tower – a Formula 1 style leaderboard with gaps and position changes. */
export default function TimingTowerScoreboard({teams, round, finished}: ScoreboardProps) {
    const order = ranked(teams);
    const before = previousRank(teams);
    const leaderScore = order[0]?.score ?? 0;

    return (
        <div style={{
            maxWidth: 360,
            background: "rgba(15,17,26,0.95)",
            borderRadius: 8,
            overflow: "hidden",
            color: "#fff",
            fontFamily: "'Titillium Web', 'Helvetica Neue', Arial, sans-serif",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        }}>
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px",
                background: finished ? "repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 16px 16px" : "#e10600",
            }}>
                <span style={{fontWeight: 900, fontStyle: "italic", fontSize: 16, background: finished ? "#000" : "transparent", padding: "0 6px"}}>
                    {finished ? "RESULTAT" : "LIVE"}
                </span>
                <span style={{fontWeight: 700, fontSize: 13, background: finished ? "#000" : "transparent", padding: "0 6px"}}>
                    OMG {round}
                </span>
            </div>
            {order.map((team, index) => {
                const change = before[team.id] - index;
                const gap = team.score - leaderScore;
                return (
                    <motion.div
                        key={team.id}
                        layout
                        transition={{type: "spring", stiffness: 300, damping: 30}}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "28px 4px 1fr 20px 70px 60px",
                            alignItems: "center",
                            gap: 8,
                            padding: "7px 12px 7px 8px",
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                            background: index === 0 ? "rgba(255,255,255,0.06)" : "transparent",
                        }}
                    >
                        <span style={{
                            background: index === 0 ? "#fff" : "transparent",
                            color: index === 0 ? "#000" : "#fff",
                            fontWeight: 800, textAlign: "center", borderRadius: 3,
                        }}>{index + 1}</span>
                        <span style={{height: 18, background: team.color, borderRadius: 1}}/>
                        <span style={{fontWeight: 800, letterSpacing: "0.06em"}}>{abbreviate(team.name)}</span>
                        <motion.span
                            key={`${round}-${change}`}
                            initial={{scale: 0}}
                            animate={{scale: 1}}
                            style={{fontSize: 11, color: change > 0 ? "#00d26a" : change < 0 ? "#ff3b3b" : "transparent"}}
                        >
                            {change > 0 ? "▲" : change < 0 ? "▼" : "•"}
                        </motion.span>
                        <span style={{textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums"}}>
                            <CountUp value={team.score}/>
                        </span>
                        <span style={{textAlign: "right", fontSize: 12, color: "#9aa0b4", fontVariantNumeric: "tabular-nums"}}>
                            {index === 0 ? (finished ? "VINNARE" : "LEDER") : formatDelta(gap)}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
}
