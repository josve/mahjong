"use client";

import React from "react";
import {AnimatePresence, motion} from "motion/react";
import {CountUp, formatDelta, ranked, ScoreboardProps} from "./shared";

const CONFETTI_COLORS = ["#ffd54f", "#ff8a65", "#4fc3f7", "#aed581", "#f06292", "#fff"];

function ConfettiBurst() {
    return (
        <>
            {Array.from({length: 36}, (_, i) => {
                const angle = (i / 36) * Math.PI * 2;
                const distance = 120 + (i % 5) * 30;
                return (
                    <motion.span
                        key={i}
                        initial={{x: 0, y: 0, opacity: 1, rotate: 0}}
                        animate={{
                            x: Math.cos(angle) * distance,
                            y: Math.sin(angle) * distance * 0.6 + 60,
                            opacity: 0,
                            rotate: 360 + i * 20,
                        }}
                        transition={{duration: 1.8, ease: "easeOut", repeat: Infinity, repeatDelay: 1.5, delay: (i % 6) * 0.03}}
                        style={{
                            position: "absolute", left: "50%", top: "40%", width: 8, height: 12,
                            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length], borderRadius: 2,
                        }}
                    />
                );
            })}
        </>
    );
}

/** 9. Champion – one big hero card for the leader, the rest of the field underneath. */
export default function ChampionScoreboard({teams, round, finished}: ScoreboardProps) {
    const [leader, ...rest] = ranked(teams);
    if (!leader) return null;
    const margin = leader.score - (rest[0]?.score ?? leader.score);

    return (
        <div style={{fontFamily: "'Karla', sans-serif"}}>
            <motion.div
                key={leader.id}
                initial={{rotateX: -70, opacity: 0}}
                animate={{rotateX: 0, opacity: 1}}
                transition={{type: "spring", stiffness: 120, damping: 14}}
                style={{
                    position: "relative", overflow: "hidden",
                    borderRadius: 18, padding: "20px 22px",
                    background: `linear-gradient(135deg, ${leader.color}, #1d1d2b)`,
                    color: "#fff",
                    border: finished ? "3px solid #ffd54f" : "3px solid transparent",
                    boxShadow: finished ? "0 0 24px rgba(255,213,79,0.6)" : "0 10px 24px rgba(0,0,0,0.2)",
                }}
            >
                {finished && (
                    <motion.div
                        animate={{x: ["-120%", "220%"]}}
                        transition={{repeat: Infinity, duration: 2.4, ease: "easeInOut", repeatDelay: 0.6}}
                        style={{
                            position: "absolute", top: 0, bottom: 0, width: "40%",
                            background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.35), transparent)",
                        }}
                    />
                )}
                {finished && <ConfettiBurst/>}
                <div style={{position: "relative", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap"}}>
                    <motion.div
                        animate={{rotate: [-8, 8, -8], y: [0, -4, 0]}}
                        transition={{repeat: Infinity, duration: 2.2, ease: "easeInOut"}}
                        style={{fontSize: 56}}
                    >
                        {finished ? "🏆" : "👑"}
                    </motion.div>
                    <div style={{flex: 1}}>
                        <div style={{fontSize: 12, letterSpacing: "0.25em", opacity: 0.8}}>
                            {finished ? "MATCHENS MÄSTARE" : `LEDER EFTER OMGÅNG ${round}`}
                        </div>
                        <div style={{fontSize: 32, fontWeight: 900, lineHeight: 1.1}}>{leader.name}</div>
                        <div style={{fontSize: 14, opacity: 0.9}}>
                            {margin > 0 ? `${margin} poäng före tvåan` : "Delad ledning!"}
                        </div>
                    </div>
                    <div style={{fontSize: 64, fontWeight: 900, lineHeight: 1, fontVariantNumeric: "tabular-nums", textShadow: "0 4px 12px rgba(0,0,0,0.3)"}}>
                        <CountUp value={leader.score} duration={1.4}/>
                    </div>
                </div>
            </motion.div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 8}}>
                <AnimatePresence mode="popLayout">
                    {rest.map((team, index) => (
                        <motion.div
                            key={team.id}
                            layout
                            initial={{opacity: 0, y: 12}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.8}}
                            style={{
                                background: "#fafafa", border: "1px solid #eee", borderLeft: `5px solid ${team.color}`,
                                borderRadius: 10, padding: "8px 10px", color: "#444",
                            }}
                        >
                            <div style={{fontSize: 12, color: "#999"}}>{index + 2}. plats</div>
                            <div style={{fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{team.name}</div>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
                                <span style={{fontSize: 22, fontWeight: 900, color: "#222"}}><CountUp value={team.score}/></span>
                                {!finished && (
                                    <span style={{fontSize: 12, fontWeight: 700, color: team.delta >= 0 ? "#2e7d32" : "#c62828"}}>
                                        {formatDelta(team.delta)}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
