"use client";

import React from "react";
import {Avatar, AvatarProps} from "@mui/material";

export const STARTING_SCORE = 500;

export interface ProposalTeam {
    id: string;
    name: string;
    /** CSS color, e.g. "rgb(229, 70, 70)". */
    color: string;
}

export interface ProposalTeamScore extends ProposalTeam {
    /** Total score after the last round. */
    score: number;
    /** Total score after every round, starting with STARTING_SCORE. */
    history: number[];
}

export const WIND_CHARS: { [wind: string]: string } = {E: "東", S: "南", W: "西", N: "北"};

export function initials(name: string): string {
    const parts = name.split(/[\s+]+/).filter(Boolean);
    if (parts.length > 1) {
        return parts.map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

export function formatDelta(delta: number): string {
    if (delta > 0) return `+${delta}`;
    if (delta < 0) return `−${Math.abs(delta)}`;
    return "±0";
}

/**
 * Score changes for one round, using the same rules as /api/addResult:
 * every team settles the difference between its hand and every other hand,
 * payments to or from east are doubled and the winner never pays.
 */
export function roundPayouts(
    teamIds: string[],
    hands: { [teamId: string]: number },
    winner: string | null,
    east: string | null,
): { [teamId: string]: number } {
    return Object.fromEntries(teamIds.map((teamId) => {
        let score = 0;
        for (const otherId of teamIds) {
            if (otherId === teamId) continue;
            let difference = (hands[teamId] ?? 0) - (hands[otherId] ?? 0);
            if (teamId === east || otherId === east) {
                difference *= 2;
            }
            score += teamId === winner ? Math.max(difference, 0) : difference;
        }
        return [teamId, score];
    }));
}

interface TeamAvatarProps extends Omit<AvatarProps, "color"> {
    readonly team: ProposalTeam;
    readonly size?: number;
}

/** Round avatar with the team's initials on the team's color. */
export function TeamAvatar({team, size = 36, sx, ...props}: TeamAvatarProps) {
    return (
        <Avatar
            alt={team.name}
            {...props}
            sx={{
                width: size,
                height: size,
                fontSize: size * 0.4,
                fontWeight: 700,
                backgroundColor: team.color,
                color: "white",
                ...sx,
            }}
        >
            {initials(team.name)}
        </Avatar>
    );
}

/** Small line chart without axes, one line per team. */
export function Sparklines({teams, width = 120, height = 36}: {
    readonly teams: ProposalTeamScore[];
    readonly width?: number;
    readonly height?: number;
}) {
    const all = teams.flatMap((team) => team.history);
    const min = Math.min(...all);
    const max = Math.max(...all);
    const rounds = Math.max(...teams.map((team) => team.history.length)) - 1;
    const x = (index: number) => rounds === 0 ? 0 : (index / rounds) * width;
    const y = (value: number) => max === min ? height / 2 : height - ((value - min) / (max - min)) * height;

    return (
        <svg width={width} height={height} viewBox={`-2 -2 ${width + 4} ${height + 4}`} aria-hidden>
            {teams.map((team) => (
                <polyline
                    key={team.id}
                    fill="none"
                    stroke={team.color}
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    points={team.history.map((value, index) => `${x(index)},${y(value)}`).join(" ")}
                />
            ))}
        </svg>
    );
}
