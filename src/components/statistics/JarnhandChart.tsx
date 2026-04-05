import React from "react";
import {MahjongStats} from "@/lib/statistics";
import {getJarnhandLabel} from "@/lib/jarnhandLabels";
import ShieldIcon from '@mui/icons-material/Shield';
import {Tooltip} from "@mui/material";

interface JarnhandChartProps {
    stats: MahjongStats;
    readonly includeTeams: boolean;
}

const getIconSize = (streakLength: number) => {
    const base = 20;
    return base + (streakLength - 3) * 6;
};

const getStreakColor = (streakLength: number): string => {
    if (streakLength >= 8) return "#1b5e20";
    if (streakLength >= 7) return "#2e7d32";
    if (streakLength >= 6) return "#388e3c";
    if (streakLength >= 5) return "#43a047";
    if (streakLength >= 4) return "#66bb6a";
    return "#81c784";
};

const JarnhandChart: React.FC<JarnhandChartProps> = ({ stats, includeTeams }) => {
    const playerStats = stats.getDataToShow(includeTeams);

    const sorted = [...playerStats]
        .filter(d => d.jarnhandCount > 0)
        .sort((a, b) => b.jarnhandCount - a.jarnhandCount);

    const longestStreakPlayer = [...playerStats]
        .filter(d => d.longestJarnhandStreak > 0)
        .sort((a, b) => b.longestJarnhandStreak - a.longestJarnhandStreak)[0];

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
                <strong>Järnhand</strong> — räknar antal gånger en spelare har positivt resultat (pluspoäng) flera rundor i rad inom samma spel.
                En svit på 3+ rundor med plusresultat registreras, och längre sviter ger eskalerande titlar:
                Järnhand, Ståndaktig, Befäst, Okuvlig, Osårbar, Orubblig.
            </div>

            {longestStreakPlayer && (
                <div style={{
                    marginBottom: "30px",
                    padding: "16px",
                    backgroundColor: "#e8f5e9",
                    borderRadius: "8px",
                    border: "1px solid #a5d6a7",
                }}>
                    <h3 style={{ margin: "0 0 8px 0" }}>
                        Längsta järnhand-sviten
                    </h3>
                    <div style={{ fontSize: "1.2em" }}>
                        <strong>{longestStreakPlayer.name}</strong> — {longestStreakPlayer.longestJarnhandStreak} rundor med plusresultat
                        {" "}({getJarnhandLabel(longestStreakPlayer.longestJarnhandStreak)})
                    </div>
                </div>
            )}

            {sorted.length === 0 && (
                <p style={{ fontStyle: "italic" }}>Inga järnhand-sviter registrerade.</p>
            )}

            {sorted.map((data) => (
                <div key={data.id} style={{ marginBottom: "20px" }}>
                    <h3 style={{ marginBottom: "4px" }}>{data.name}</h3>
                    <div style={{ marginBottom: "8px", color: "#666" }}>
                        Totalt: {data.jarnhandCount} järnhand-sviter
                        {data.longestJarnhandStreak >= 3 && (
                            <> · Längsta svit: {data.longestJarnhandStreak} rundor ({getJarnhandLabel(data.longestJarnhandStreak)})</>
                        )}
                    </div>
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        alignItems: "center",
                    }}>
                        {data.jarnhandStreaks.map((s) => {
                            if (includeTeams && s.isTeam && data.isPlayer()) return null;
                            const size = getIconSize(s.streakLength);
                            return (
                                <Tooltip
                                    key={s.jarnhandIndex}
                                    title={`Spel #${s.gameIndex + 1}: ${s.streakLength} rundor med plusresultat — ${getJarnhandLabel(s.streakLength)}`}
                                >
                                    <ShieldIcon
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

export default JarnhandChart;
