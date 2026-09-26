"use client";

import React from "react";
import {motion} from "motion/react";
import {CountUp, ranked, ScoreboardProps, STARTING_SCORE} from "./shared";

const CHECKERED = "repeating-conic-gradient(#111 0% 25%, #fff 0% 50%) 50% / 10px 10px";

/** 3. Race track – every team is a runner, the leader is closest to the finish line. */
export default function RaceTrackScoreboard({teams, round, finished}: ScoreboardProps) {
    const order = ranked(teams);
    const scores = teams.map((team) => team.score);
    const low = Math.min(STARTING_SCORE, ...scores) - 40;
    const high = Math.max(STARTING_SCORE, ...scores) + 20;
    const position = (score: number) => 4 + ((score - low) / (high - low)) * 84;

    return (
        <div style={{
            background: "linear-gradient(#3f9b4a, #2f7d3a)",
            borderRadius: 12,
            padding: "12px 14px",
            fontFamily: "'Karla', sans-serif",
            color: "#fff",
        }}>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: 8, fontWeight: 700, letterSpacing: "0.1em"}}>
                <span>🏁 KAPPLÖPNINGEN</span>
                <span>{finished ? "I MÅL!" : `VARV ${round}`}</span>
            </div>
            <div style={{position: "relative", borderRadius: 8, overflow: "hidden", background: "#c2573a"}}>
                <div style={{position: "absolute", top: 0, bottom: 0, right: "6%", width: 12, background: CHECKERED, zIndex: 1}}/>
                {teams.map((team, lane) => {
                    const place = order.findIndex((t) => t.id === team.id);
                    const winner = finished && place === 0;
                    const left = position(team.score);
                    return (
                        <div key={team.id} style={{
                            position: "relative",
                            height: 50,
                            borderTop: lane === 0 ? "none" : "2px dashed rgba(255,255,255,0.7)",
                        }}>
                            <span style={{position: "absolute", left: 8, top: 4, fontSize: 11, opacity: 0.85}}>
                                BANA {lane + 1}
                            </span>
                            <motion.div
                                initial={false}
                                animate={{left: `${left}%`}}
                                transition={{type: "spring", stiffness: 60, damping: 14}}
                                style={{position: "absolute", top: 7, marginLeft: -18, zIndex: 2}}
                            >
                                <motion.div
                                    animate={finished ? {} : {y: [0, -4, 0]}}
                                    transition={{repeat: Infinity, duration: 0.45 + lane * 0.05}}
                                    style={{
                                        width: 36, height: 36, borderRadius: "50%",
                                        background: team.color,
                                        border: "3px solid #fff",
                                        boxShadow: "0 3px 6px rgba(0,0,0,0.35)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontWeight: 800, fontSize: 16,
                                    }}
                                >
                                    {winner ? "🏆" : team.name[0]}
                                </motion.div>
                                <div style={{
                                    position: "absolute", top: 2,
                                    ...(left > 55 ? {right: 42} : {left: 42}),
                                    background: "rgba(0,0,0,0.55)", borderRadius: 6, padding: "2px 6px",
                                    fontSize: 12, lineHeight: 1.2, whiteSpace: "nowrap",
                                }}>
                                    <div style={{fontWeight: 700}}>{place + 1}. {team.name}</div>
                                    <div><CountUp value={team.score}/> p</div>
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
