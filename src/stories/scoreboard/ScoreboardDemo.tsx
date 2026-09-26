"use client";

import React, {useEffect, useState} from "react";
import type {GameWithHands} from "@/types/db";
import {activeMatch, teamAndPlayerColors, teamIdToName} from "@/stories/fixtures";
import {STARTING_SCORE, ScoreboardProps, ScoreboardTeam} from "@/components/match/scoreboard/shared";

export function teamsAfterRound(game: GameWithHands, round: number): ScoreboardTeam[] {
    const ids = [game.TEAM_ID_1, game.TEAM_ID_2, game.TEAM_ID_3, game.TEAM_ID_4];
    return ids.map((id) => {
        const hands = game.hands.filter((hand) => hand.TEAM_ID === id && hand.ROUND <= round);
        const latest = hands.find((hand) => hand.ROUND === round);
        const color = teamAndPlayerColors[id];
        return {
            id,
            name: teamIdToName[id],
            color: `rgb(${Math.round(color.color_red)}, ${Math.round(color.color_green)}, ${Math.round(color.color_blue)})`,
            score: STARTING_SCORE + hands.reduce((sum, hand) => sum + hand.HAND_SCORE, 0),
            delta: latest?.HAND_SCORE ?? 0,
            wind: latest?.WIND,
            wonRound: latest?.IS_WINNER,
        };
    });
}

export function lastRound(game: GameWithHands): number {
    return Math.max(...game.hands.map((hand) => hand.ROUND));
}

interface Props {
    readonly scoreboard: React.ComponentType<ScoreboardProps>;
    /** "live" plays the match round by round, "final" shows the final result. */
    readonly mode: "live" | "final";
    readonly game?: GameWithHands;
    /** Milliseconds between rounds in live mode. */
    readonly speed?: number;
}

/** Plays a fixture match through a scoreboard concept, with controls to step between rounds. */
export default function ScoreboardDemo({scoreboard: Scoreboard, mode, game = activeMatch, speed = 2500}: Props) {
    const maxRound = lastRound(game);
    const [round, setRound] = useState(mode === "final" ? maxRound : 1);
    const [finished, setFinished] = useState(mode === "final");
    const [playing, setPlaying] = useState(mode === "live");

    useEffect(() => {
        setRound(mode === "final" ? maxRound : 1);
        setFinished(mode === "final");
        setPlaying(mode === "live");
    }, [mode, maxRound]);

    useEffect(() => {
        if (!playing) return;
        const timer = setTimeout(() => {
            if (finished) {
                setRound(1);
                setFinished(false);
            } else if (round >= maxRound) {
                setFinished(true);
            } else {
                setRound(round + 1);
            }
        }, finished ? speed * 2.5 : speed);
        return () => clearTimeout(timer);
    }, [playing, round, finished, maxRound, speed]);

    const step = (change: number) => {
        setPlaying(false);
        setFinished(false);
        setRound(Math.min(maxRound, Math.max(1, round + change)));
    };

    const button: React.CSSProperties = {
        border: "1px solid #ccc", background: "#fff", borderRadius: 6, padding: "4px 10px",
        cursor: "pointer", fontSize: 13, color: "#444",
    };

    return (
        <div style={{maxWidth: 900}}>
            <Scoreboard teams={teamsAfterRound(game, round)} round={round} finished={finished} matchName={game.NAME}/>
            <div style={{display: "flex", gap: 8, alignItems: "center", marginTop: 16, fontFamily: "sans-serif", fontSize: 13, color: "#666"}}>
                <button style={button} onClick={() => step(-1)}>◀</button>
                <button style={button} onClick={() => setPlaying(!playing)}>{playing ? "⏸ Pausa" : "▶ Spela"}</button>
                <button style={button} onClick={() => step(1)}>▶</button>
                <button style={button} onClick={() => {
                    setPlaying(false);
                    setRound(maxRound);
                    setFinished(true);
                }}>Slutresultat</button>
                <span>Omgång {round}/{maxRound}{finished ? " · avslutad" : ""}</span>
            </div>
        </div>
    );
}
