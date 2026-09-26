"use client";

import React from "react";
import {motion} from "motion/react";
import {abbreviate, CountUp, formatDelta, ranked, ScoreboardProps} from "./shared";

/** 6. TV broadcast – a compact score bug with a news ticker, like a sports broadcast. */
export default function BroadcastScoreboard({teams, round, finished, matchName}: ScoreboardProps) {
    const order = ranked(teams);
    const leader = order[0];
    const ticker = finished
        ? `${leader?.name} vinner ${matchName ?? "matchen"} med ${leader?.score} poäng  ·  ` +
          order.map((team, i) => `${i + 1}. ${team.name} ${team.score}`).join("  ·  ")
        : `Omgång ${round}:  ` + teams.map((team) => `${team.name} ${formatDelta(team.delta)}${team.wonRound ? " (mahjong!)" : ""}`).join("  ·  ");

    return (
        <div style={{fontFamily: "'Karla', 'Helvetica Neue', Arial, sans-serif", filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))"}}>
            <div style={{display: "flex", alignItems: "stretch", borderRadius: "8px 8px 0 0", overflow: "hidden", flexWrap: "wrap"}}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
                    color: "#fff", padding: "8px 14px", fontWeight: 900, letterSpacing: "0.08em",
                }}>
                    <motion.span
                        animate={finished ? {opacity: 1} : {opacity: [1, 0.2, 1]}}
                        transition={{repeat: Infinity, duration: 1.2}}
                        style={{width: 10, height: 10, borderRadius: "50%", background: finished ? "#fff" : "#ff2a2a", boxShadow: "0 0 6px #ff2a2a"}}
                    />
                    {finished ? "SLUT" : "LIVE"}
                </div>
                {teams.map((team) => (
                    <div key={team.id} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        background: team.id === leader?.id ? "#fff" : "#f1f1f1",
                        padding: "8px 12px", borderRight: "1px solid #ddd",
                        flex: "1 1 auto",
                    }}>
                        <span style={{width: 6, alignSelf: "stretch", background: team.color, borderRadius: 2}}/>
                        <span style={{fontWeight: 800, color: "#333", letterSpacing: "0.05em"}}>{abbreviate(team.name)}</span>
                        <motion.span
                            key={team.score}
                            initial={{backgroundColor: team.delta > 0 ? "#b8f5c8" : team.delta < 0 ? "#ffc9c9" : "#ffffff00"}}
                            animate={{backgroundColor: "#ffffff00"}}
                            transition={{duration: 1.5}}
                            style={{fontWeight: 900, fontSize: 20, color: "#111", borderRadius: 4, padding: "0 4px", fontVariantNumeric: "tabular-nums"}}
                        >
                            <CountUp value={team.score}/>
                        </motion.span>
                    </div>
                ))}
                <div style={{display: "flex", alignItems: "center", background: "#222", color: "#fff", padding: "8px 12px", fontWeight: 700}}>
                    {finished ? "FT" : `R${round}`}
                </div>
            </div>
            <div style={{background: "#111", color: "#f5c400", overflow: "hidden", whiteSpace: "nowrap", borderRadius: "0 0 8px 8px", fontSize: 13, position: "relative", height: 24}}>
                <motion.div
                    key={ticker}
                    initial={{left: "100%", x: "0%"}}
                    animate={{left: "0%", x: "-100%"}}
                    transition={{repeat: Infinity, duration: 14, ease: "linear"}}
                    style={{position: "absolute", top: 4, paddingLeft: 10}}
                >
                    {ticker}
                </motion.div>
            </div>
        </div>
    );
}
