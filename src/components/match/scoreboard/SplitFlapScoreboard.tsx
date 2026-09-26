"use client";

import React from "react";
import {AnimatePresence, motion} from "motion/react";
import {formatDelta, ranked, ScoreboardProps} from "./shared";

function Flap({char, width = 30, delay = 0}: { readonly char: string; readonly width?: number; readonly delay?: number }) {
    return (
        <span style={{
            position: "relative",
            display: "inline-block",
            width,
            height: width * 1.45,
            margin: "0 1.5px",
            perspective: 200,
            background: "#1e1e1e",
            borderRadius: 4,
            boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.5)",
            overflow: "hidden",
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
                        color: "#f4f1e8",
                        fontSize: width * 0.95,
                        fontWeight: 700,
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        transformOrigin: "50% 50%",
                    }}
                >
                    {char}
                </motion.span>
            </AnimatePresence>
            <span style={{position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "rgba(0,0,0,0.85)"}}/>
        </span>
    );
}

/** 2. Split-flap – a mechanical departure board where every digit flips. */
export default function SplitFlapScoreboard({teams, round, finished}: ScoreboardProps) {
    const rows = ranked(teams);

    return (
        <div style={{
            background: "linear-gradient(#2b2b2b, #151515)",
            borderRadius: 10,
            padding: "14px 16px",
            color: "#f4f1e8",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            boxShadow: "0 10px 24px rgba(0,0,0,0.3)",
            overflowX: "auto",
        }}>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 12, letterSpacing: "0.2em", color: "#f5c400"}}>
                <span>STÄLLNING</span>
                <span>{finished ? "SLUTRESULTAT" : `OMGÅNG ${round}`}</span>
            </div>
            {rows.map((team, index) => {
                const score = String(team.score).padStart(4, " ").split("");
                const delta = finished ? "" : formatDelta(team.delta);
                return (
                    <motion.div
                        layout
                        key={team.id}
                        transition={{type: "spring", stiffness: 200, damping: 25}}
                        style={{display: "flex", alignItems: "center", gap: 10, padding: "4px 0"}}
                    >
                        <Flap char={String(index + 1)} width={22}/>
                        <span style={{width: 6, height: 30, borderRadius: 2, background: team.color}}/>
                        <span style={{flex: 1, minWidth: 90, fontSize: 18, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase"}}>
                            {team.name}
                        </span>
                        <span style={{whiteSpace: "nowrap"}}>
                            {score.map((char, i) => <Flap key={i} char={char} delay={i * 0.07}/>)}
                        </span>
                        <span style={{
                            width: 52, textAlign: "right", fontSize: 14, fontWeight: 700,
                            color: team.delta > 0 ? "#6be38a" : team.delta < 0 ? "#ff7070" : "#999",
                        }}>
                            {delta}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
}
