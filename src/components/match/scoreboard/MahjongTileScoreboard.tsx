"use client";

import React from "react";
import {AnimatePresence, motion} from "motion/react";
import {formatDelta, ranked, ScoreboardProps, WIND_CHARS} from "./shared";

const RANK_CHARS = ["一", "二", "三", "四"];

function Tile({children, color = "#1d1d1d", highlight = false, delay = 0}: {
    readonly children: React.ReactNode;
    readonly color?: string;
    readonly highlight?: boolean;
    readonly delay?: number;
}) {
    return (
        <span style={{
            position: "relative", display: "inline-block", width: 32, height: 44, margin: "0 2px",
            perspective: 300,
        }}>
            <AnimatePresence initial={false}>
                <motion.span
                    key={String(children)}
                    initial={{rotateY: 90}}
                    animate={{rotateY: 0}}
                    exit={{rotateY: -90, opacity: 0}}
                    transition={{duration: 0.3, delay}}
                    style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: highlight ? "linear-gradient(#fff8dc, #f3e2a6)" : "linear-gradient(#fffdf6, #efe8d6)",
                        borderRadius: 5,
                        boxShadow: "0 4px 0 #1f7a4d, 0 5px 0 #145535, 0 7px 6px rgba(0,0,0,0.35)",
                        color, fontSize: 22, fontWeight: 800,
                        fontFamily: "'Noto Serif SC', 'Songti SC', serif",
                    }}
                >
                    {children}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

/** 7. Mahjong tiles – every score is laid out with tiles on a green felt table. */
export default function MahjongTileScoreboard({teams, round, finished}: ScoreboardProps) {
    const order = ranked(teams);

    return (
        <div style={{
            background: "radial-gradient(ellipse at center, #2e8b57 0%, #1b5e3a 100%)",
            border: "8px solid #6b3f1f",
            borderRadius: 16,
            padding: "12px 14px 16px",
            color: "#fff",
            fontFamily: "'Karla', sans-serif",
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.4)",
        }}>
            <div style={{textAlign: "center", fontWeight: 700, letterSpacing: "0.2em", marginBottom: 10, color: "#f7e7b4"}}>
                {finished ? "終 · SLUTRESULTAT · 終" : `第 ${round} 局 · OMGÅNG ${round}`}
            </div>
            <div style={{display: "grid", gap: 12}}>
                {order.map((team, index) => {
                    const digits = String(team.score).split("");
                    const winner = finished && index === 0;
                    return (
                        <motion.div
                            key={team.id}
                            layout
                            transition={{type: "spring", stiffness: 200, damping: 24}}
                            style={{display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap"}}
                        >
                            <Tile color="#b3001b">{RANK_CHARS[index]}</Tile>
                            <Tile color={team.wind === "E" ? "#b3001b" : "#1d1d1d"}>{WIND_CHARS[team.wind ?? ""] ?? "🀄"}</Tile>
                            <div style={{flex: 1, minWidth: 90}}>
                                <div style={{fontWeight: 700, fontSize: 16}}>
                                    <span style={{display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: team.color, marginRight: 6, border: "1px solid #fff"}}/>
                                    {team.name} {winner && "👑"}
                                </div>
                                <div style={{fontSize: 12, color: team.delta >= 0 ? "#b9f6ca" : "#ffcdd2"}}>
                                    {finished ? " " : `${formatDelta(team.delta)}${team.wonRound ? " · 和 Mahjong!" : ""}`}
                                </div>
                            </div>
                            <span style={{whiteSpace: "nowrap"}}>
                                {digits.map((digit, i) => (
                                    <Tile key={digits.length - i} highlight={winner} delay={i * 0.06}>{digit}</Tile>
                                ))}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
