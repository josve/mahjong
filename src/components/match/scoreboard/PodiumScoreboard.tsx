"use client";

import React from "react";
import {motion} from "motion/react";
import {CountUp, ranked, ScoreboardProps} from "./shared";

const MEDALS = ["🥇", "🥈", "🥉", ""];
const HEIGHTS = [130, 100, 76, 52];
const BLOCK_COLORS = ["#d4a017", "#a8a9ad", "#b0703c", "#7d6a5a"];
/** Visual order from left to right: 4th, 2nd, 1st, 3rd. */
const SLOT_ORDER = [3, 1, 0, 2];

/** 4. Podium – the standings as a prize podium, with spotlights once the match is over. */
export default function PodiumScoreboard({teams, round, finished}: ScoreboardProps) {
    const order = ranked(teams);

    return (
        <div style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 12,
            padding: "14px 12px 0",
            background: finished ? "linear-gradient(#1c1633, #3b2d63)" : "linear-gradient(#f7f1ea, #efe4d6)",
            color: finished ? "#fff" : "#3a2e25",
            fontFamily: "'Karla', sans-serif",
            transition: "background 0.6s",
        }}>
            {finished && [-1, 1].map((side) => (
                <motion.div
                    key={side}
                    animate={{rotate: [side * 18, side * -8, side * 18]}}
                    transition={{repeat: Infinity, duration: 4, ease: "easeInOut"}}
                    style={{
                        position: "absolute", top: -20, left: "50%", width: 300, height: 360, marginLeft: -150,
                        transformOrigin: "50% 0%",
                        background: "linear-gradient(rgba(255,240,180,0.3), transparent 85%)",
                        clipPath: "polygon(47% 0, 53% 0, 85% 100%, 15% 100%)",
                    }}
                />
            ))}
            <div style={{position: "relative", textAlign: "center", fontWeight: 800, letterSpacing: "0.15em", marginBottom: 28}}>
                {finished ? "🏆 PRISUTDELNING 🏆" : `STÄLLNING EFTER OMGÅNG ${round}`}
            </div>
            <div style={{position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 6}}>
                {SLOT_ORDER.map((place) => {
                    const team = order[place];
                    if (!team) return null;
                    return (
                        <motion.div
                            key={team.id}
                            layout
                            transition={{type: "spring", stiffness: 120, damping: 18}}
                            style={{flex: 1, maxWidth: 150, display: "flex", flexDirection: "column", alignItems: "center"}}
                        >
                            <motion.div
                                animate={place === 0 ? {y: [0, -6, 0]} : {y: 0}}
                                transition={{repeat: Infinity, duration: 1.6}}
                                style={{
                                    width: 48, height: 48, borderRadius: "50%", background: team.color,
                                    border: "3px solid #fff", boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontWeight: 800, fontSize: 20, position: "relative",
                                }}
                            >
                                {team.name[0]}
                                {place === 0 && <span style={{position: "absolute", top: -22, fontSize: 22}}>👑</span>}
                            </motion.div>
                            <div style={{fontWeight: 700, margin: "4px 0 2px", fontSize: 14, textAlign: "center"}}>{team.name}</div>
                            <motion.div
                                initial={false}
                                animate={{height: HEIGHTS[place]}}
                                transition={{type: "spring", stiffness: 120, damping: 16}}
                                style={{
                                    width: "100%",
                                    background: `linear-gradient(${BLOCK_COLORS[place]}, ${BLOCK_COLORS[place]}cc)`,
                                    borderRadius: "6px 6px 0 0",
                                    boxShadow: "inset 0 3px 0 rgba(255,255,255,0.4)",
                                    display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 6,
                                    color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                                }}
                            >
                                <span style={{fontSize: 26, fontWeight: 900, lineHeight: 1}}>{finished ? MEDALS[place] || place + 1 : place + 1}</span>
                                <span style={{fontSize: 16, fontWeight: 700}}><CountUp value={team.score}/></span>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
