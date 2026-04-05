import React from "react";
import {MahjongStats} from "@/lib/statistics";
import {getHogmodLabel} from "@/lib/hogmodLabels";
import CastleIcon from '@mui/icons-material/Castle';
import {Tooltip} from "@mui/material";

interface HogmodChartProps {
    stats: MahjongStats;
    readonly includeTeams: boolean;
}

const getIconSize = (streakLength: number) => {
    const base = 20;
    return base + (streakLength - 2) * 6;
};

const getStreakColor = (streakLength: number): string => {
    if (streakLength >= 7) return "#b71c1c";
    if (streakLength >= 6) return "#e65100";
    if (streakLength >= 5) return "#f57f17";
    if (streakLength >= 4) return "#ff8f00";
    if (streakLength >= 3) return "#ffa000";
    return "#ffc107";
};

const HogmodChart: React.FC<HogmodChartProps> = ({ stats, includeTeams }) => {
    const playerStats = stats.getDataToShow(includeTeams);

    const sorted = [...playerStats]
        .filter(d => d.hogmodCount > 0)
        .sort((a, b) => b.hogmodCount - a.hogmodCount);

    const longestStreakPlayer = [...playerStats]
        .filter(d => d.longestHogmodStreak > 0)
        .sort((a, b) => b.longestHogmodStreak - a.longestHogmodStreak)[0];

    return (
        <div style={{ paddingTop: "20px" }}>
            {longestStreakPlayer && (
                <div style={{
                    marginBottom: "30px",
                    padding: "16px",
                    backgroundColor: "#fff8e1",
                    borderRadius: "8px",
                    border: "1px solid #ffe082",
                }}>
                    <h3 style={{ margin: "0 0 8px 0" }}>
                        Längsta sviten
                    </h3>
                    <div style={{ fontSize: "1.2em" }}>
                        <strong>{longestStreakPlayer.name}</strong> — {longestStreakPlayer.longestHogmodStreak} rundor i Öst
                        {" "}({getHogmodLabel(longestStreakPlayer.longestHogmodStreak)})
                    </div>
                </div>
            )}

            {sorted.length === 0 && (
                <p style={{ fontStyle: "italic" }}>Inga högmod registrerade.</p>
            )}

            {sorted.map((data) => (
                <div key={data.id} style={{ marginBottom: "20px" }}>
                    <h3 style={{ marginBottom: "4px" }}>{data.name}</h3>
                    <div style={{ marginBottom: "8px", color: "#666" }}>
                        Totalt: {data.hogmodCount} högmod
                        {data.longestHogmodStreak >= 2 && (
                            <> · Längsta svit: {data.longestHogmodStreak} rundor ({getHogmodLabel(data.longestHogmodStreak)})</>
                        )}
                    </div>
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        alignItems: "center",
                    }}>
                        {data.hogmodStreaks.map((h) => {
                            if (includeTeams && h.isTeam && data.isPlayer()) return null;
                            const size = getIconSize(h.streakLength);
                            return (
                                <Tooltip
                                    key={h.hogmodIndex}
                                    title={`Spel #${h.gameIndex + 1}: ${h.streakLength} rundor i Öst — ${getHogmodLabel(h.streakLength)}`}
                                >
                                    <CastleIcon
                                        style={{
                                            fontSize: size,
                                            color: getStreakColor(h.streakLength),
                                            opacity: h.isTeam ? 0.5 : 1,
                                        }}
                                    />
                                </Tooltip>
                            );
                        })}
                    </div>
                </div>
            ))}
            <div style={{ fontStyle: "italic", paddingTop: "20px", color: "#666" }}>
                Halvtransparenta ikoner är från lagspel.
            </div>
        </div>
    );
};

export default HogmodChart;
