"use client";

import React, {useEffect, useRef, useState} from "react";
import {animate} from "motion/react";

export const STARTING_SCORE = 500;

export interface ScoreboardTeam {
    id: string;
    name: string;
    /** CSS color, e.g. "rgb(229, 70, 70)". */
    color: string;
    /** Total score after the latest round. */
    score: number;
    /** Score change in the latest round. */
    delta: number;
    /** Wind in the latest round (E, S, W, N). */
    wind?: string;
    /** True if the team took mahjong in the latest round. */
    wonRound?: boolean;
}

export interface ScoreboardProps {
    /** Teams in seat order; the scoreboards sort them themselves. */
    readonly teams: ScoreboardTeam[];
    /** Number of rounds played so far. */
    readonly round: number;
    /** True when the match is over and the scores are final. */
    readonly finished: boolean;
    readonly matchName?: string;
}

/** Teams sorted by score, leader first. */
export function ranked(teams: ScoreboardTeam[]): ScoreboardTeam[] {
    return [...teams].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

/** Ranking before the latest round, used to show position changes. */
export function previousRank(teams: ScoreboardTeam[]): { [teamId: string]: number } {
    const before = [...teams].sort((a, b) => (b.score - b.delta) - (a.score - a.delta) || a.name.localeCompare(b.name));
    return Object.fromEntries(before.map((team, index) => [team.id, index]));
}

export function formatDelta(delta: number): string {
    if (delta > 0) return `+${delta}`;
    if (delta < 0) return `−${Math.abs(delta)}`;
    return "±0";
}

export function abbreviate(name: string, length = 3): string {
    return name.replace(/[^A-Za-zÅÄÖåäö]/g, "").slice(0, length).toUpperCase();
}

export const WIND_NAMES: { [wind: string]: string } = {E: "Öst", S: "Syd", W: "Väst", N: "Norr"};
export const WIND_CHARS: { [wind: string]: string } = {E: "東", S: "南", W: "西", N: "北"};

/** Animates a number towards `value` every time it changes. */
export function useCountUp(value: number, duration = 0.9): number {
    const [display, setDisplay] = useState(value);
    const current = useRef(value);

    useEffect(() => {
        const controls = animate(current.current, value, {
            duration,
            ease: "easeOut",
            onUpdate: (latest) => {
                current.current = latest;
                setDisplay(Math.round(latest));
            },
        });
        return () => controls.stop();
    }, [value, duration]);

    return display;
}

export function CountUp({value, duration}: { readonly value: number; readonly duration?: number }) {
    return <>{useCountUp(value, duration)}</>;
}
