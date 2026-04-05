import React from "react";
import {MahjongStats} from "@/lib/statistics";
import {getStorvinnareLabel} from "@/lib/storvinnareLabels";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {Tooltip} from "@mui/material";

interface StorvinnareChartProps {
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

const StorvinnareChart: React.FC<StorvinnareChartProps> = ({ stats, includeTeams }) => {
    const playerStats = stats.getDataToShow(includeTeams);

    const sorted = [...playerStats]
        .filter(d => d.storvinnareCount > 0)
        .sort((a, b) => b.storvinnareCount - a.storvinnareCount);

    const longestStreakPlayer = [...playerStats]
        .filter(d => d.longestStorvinnareStreak > 0)
        .sort((a, b) => b.longestStorvinnareStreak - a.longestStorvinnareStreak)[0];

    return (
        <div style={{ paddingTop: "20px" }}>
            <div style={{
                marginBottom: "20px",
                padding: "12px 16px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                color: "#555",
                lineHeight: 1.5,
            }}>
                <strong>Storvinnare</strong> — räknar antal gånger en spelare vinner mahjong flera rundor i rad inom samma spel.
                En svit på 2+ vinster i rad registreras, och längre sviter ger eskalerande titlar:
                Storvinnare, Segrare, Champion, Mästare, Dominant, Oövervinnlig.
            </div>

            {longestStreakPlayer && (
                <div style={{
                    marginBottom: "30px",
                    padding: "16px",
                    backgroundColor: "#fff8e1",
                    borderRadius: "8px",
                    border: "1px solid #ffe082",
                }}>
                    <h3 style={{ margin: "0 0 8px 0" }}>
                        Längsta vinstsviten
                    </h3>
                    <div style={{ fontSize: "1.2em" }}>
                        <strong>{longestStreakPlayer.name}</strong> — {longestStreakPlayer.longestStorvinnareStreak} vinster i rad
                        {" "}({getStorvinnareLabel(longestStreakPlayer.longestStorvinnareStreak)})
                    </div>
                </div>
            )}

            {sorted.length === 0 && (
                <p style={{ fontStyle: "italic" }}>Inga vinstsviter registrerade.</p>
            )}

            {sorted.map((data) => (
                <div key={data.id} style={{ marginBottom: "20px" }}>
                    <h3 style={{ marginBottom: "4px" }}>{data.name}</h3>
                    <div style={{ marginBottom: "8px", color: "#666" }}>
                        Totalt: {data.storvinnareCount} vinstsviter
                        {data.longestStorvinnareStreak >= 2 && (
                            <> · Längsta svit: {data.longestStorvinnareStreak} vinster ({getStorvinnareLabel(data.longestStorvinnareStreak)})</>
                        )}
                    </div>
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        alignItems: "center",
                    }}>
                        {data.storvinnareStreaks.map((s) => {
                            if (includeTeams && s.isTeam && data.isPlayer()) return null;
                            const size = getIconSize(s.streakLength);
                            return (
                                <Tooltip
                                    key={s.storvinnareIndex}
                                    title={`Spel #${s.gameIndex + 1}: ${s.streakLength} vinster i rad — ${getStorvinnareLabel(s.streakLength)}`}
                                >
                                    <EmojiEventsIcon
                                        style={{
                                            fontSize: size,
                                            color: getStreakColor(s.streakLength),
                                            opacity: s.isTeam ? 0.5 : 1,
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

export default StorvinnareChart;
