"use client";

import React from "react";
import {AnimatePresence, motion} from "motion/react";
import {CountUp, formatDelta, ranked, ScoreboardProps} from "./shared";

const AMBER = "#ffb300";

/** 1. Arena – a dark stadium jumbotron with glowing LED digits. */
export default function ArenaScoreboard({teams, round, finished, matchName}: ScoreboardProps) {
    const leaderId = ranked(teams)[0]?.id;

    return (
        <div style={{
            background: "#07090d",
            backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "6px 6px",
            border: "6px solid #1b1f27",
            borderRadius: 14,
            boxShadow: "0 12px 30px rgba(0,0,0,0.35), inset 0 0 40px rgba(0,0,0,0.8)",
            padding: "14px 16px 18px",
            color: "#fff",
            fontFamily: "'Courier New', ui-monospace, monospace",
        }}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12}}>
                <span style={{letterSpacing: "0.2em", fontSize: 12, color: "#8a93a6", textTransform: "uppercase"}}>
                    {matchName}
                </span>
                <motion.span
                    key={finished ? "final" : "live"}
                    animate={finished ? {opacity: [1, 0.25, 1]} : {opacity: 1}}
                    transition={finished ? {repeat: Infinity, duration: 1.2} : undefined}
                    style={{
                        color: finished ? "#ff3d3d" : AMBER,
                        textShadow: `0 0 8px ${finished ? "#ff3d3d" : AMBER}`,
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                    }}
                >
                    {finished ? "SLUTSIGNAL" : `OMGÅNG ${round}`}
                </motion.span>
            </div>

            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10}}>
                {teams.map((team) => {
                    const isLeader = team.id === leaderId;
                    return (
                        <div key={team.id} style={{
                            position: "relative",
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: 8,
                            borderTop: `4px solid ${team.color}`,
                            padding: "10px 10px 12px",
                            textAlign: "center",
                            overflow: "hidden",
                        }}>
                            {isLeader && (
                                <motion.div
                                    animate={{opacity: [0.15, 0.4, 0.15]}}
                                    transition={{repeat: Infinity, duration: 2}}
                                    style={{
                                        position: "absolute", inset: 0,
                                        background: `radial-gradient(circle at 50% 0%, ${AMBER}55, transparent 70%)`,
                                    }}
                                />
                            )}
                            <div style={{position: "relative", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "#cfd6e4"}}>
                                {isLeader && "★ "}{team.name}
                            </div>
                            <div style={{
                                position: "relative",
                                fontSize: 48,
                                fontWeight: 700,
                                lineHeight: 1.1,
                                color: AMBER,
                                textShadow: `0 0 6px ${AMBER}, 0 0 18px ${AMBER}88`,
                                fontVariantNumeric: "tabular-nums",
                            }}>
                                <CountUp value={team.score}/>
                            </div>
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={round}
                                    initial={{y: 16, opacity: 0, scale: 0.6}}
                                    animate={{y: 0, opacity: 1, scale: 1}}
                                    exit={{y: -16, opacity: 0}}
                                    transition={{type: "spring", stiffness: 400, damping: 18}}
                                    style={{
                                        position: "relative",
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: team.delta > 0 ? "#3dff8b" : team.delta < 0 ? "#ff5c5c" : "#8a93a6",
                                    }}
                                >
                                    {finished ? (isLeader ? "VINNARE" : " ") : formatDelta(team.delta)}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
