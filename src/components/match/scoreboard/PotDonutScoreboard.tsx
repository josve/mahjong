"use client";

import React from "react";
import {motion} from "motion/react";
import {CountUp, formatDelta, ranked, ScoreboardProps} from "./shared";

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** 8. The pot – mahjong is zero-sum, so the ring shows each team's share of all points on the table. */
export default function PotDonutScoreboard({teams, round, finished}: ScoreboardProps) {
    const order = ranked(teams);
    const leader = order[0];
    const total = teams.reduce((sum, team) => sum + Math.max(team.score, 0), 0) || 1;
    let offset = 0;

    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", justifyContent: "center",
            background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: 16,
            fontFamily: "'Karla', sans-serif", color: "#444",
        }}>
            <div style={{position: "relative", width: 200, height: 200}}>
                <svg viewBox="0 0 200 200" width={200} height={200} style={{transform: "rotate(-90deg)"}}>
                    <circle cx={100} cy={100} r={RADIUS} fill="none" stroke="#f1f1f1" strokeWidth={26}/>
                    {teams.map((team) => {
                        const length = (Math.max(team.score, 0) / total) * CIRCUMFERENCE;
                        const dashOffset = -offset;
                        offset += length;
                        return (
                            <motion.circle
                                key={team.id}
                                cx={100} cy={100} r={RADIUS}
                                fill="none"
                                stroke={team.color}
                                strokeWidth={team.id === leader?.id ? 32 : 26}
                                initial={false}
                                animate={{
                                    strokeDasharray: `${Math.max(length - 2, 0)} ${CIRCUMFERENCE}`,
                                    strokeDashoffset: dashOffset,
                                }}
                                transition={{type: "spring", stiffness: 80, damping: 16}}
                            />
                        );
                    })}
                </svg>
                <div style={{
                    position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", textAlign: "center",
                }}>
                    <motion.div
                        key={finished ? "trophy" : "pot"}
                        initial={{scale: 0, rotate: -30}}
                        animate={{scale: 1, rotate: 0}}
                        transition={{type: "spring", stiffness: 260, damping: 12}}
                        style={{fontSize: 22}}
                    >
                        {finished ? "🏆" : "💰"}
                    </motion.div>
                    <div style={{fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#999"}}>
                        {finished ? "Vinnare" : `Leder · omg ${round}`}
                    </div>
                    <div style={{fontWeight: 800, color: leader?.color}}>{leader?.name}</div>
                    <div style={{fontSize: 26, fontWeight: 900, color: "#222"}}>
                        <CountUp value={leader?.score ?? 0}/>
                    </div>
                </div>
            </div>
            <div style={{display: "grid", gap: 8, minWidth: 200}}>
                {order.map((team) => (
                    <motion.div key={team.id} layout style={{display: "flex", alignItems: "center", gap: 10}}>
                        <span style={{width: 14, height: 14, borderRadius: 4, background: team.color}}/>
                        <span style={{flex: 1, fontWeight: 600}}>{team.name}</span>
                        <span style={{fontWeight: 800, fontVariantNumeric: "tabular-nums"}}><CountUp value={team.score}/></span>
                        <span style={{width: 44, textAlign: "right", fontSize: 12, color: "#999"}}>
                            {Math.round((Math.max(team.score, 0) / total) * 100)}%
                        </span>
                        {!finished && (
                            <span style={{width: 44, textAlign: "right", fontSize: 12, fontWeight: 700, color: team.delta >= 0 ? "#2e7d32" : "#c62828"}}>
                                {formatDelta(team.delta)}
                            </span>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
