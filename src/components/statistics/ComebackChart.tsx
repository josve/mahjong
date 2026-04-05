import React from "react";
import {MahjongStats} from "@/lib/statistics";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {Tooltip} from "@mui/material";

interface ComebackChartProps {
    stats: MahjongStats;
    readonly includeTeams: boolean;
}

const ComebackChart: React.FC<ComebackChartProps> = ({ stats, includeTeams }) => {
    const playerStats = stats.getDataToShow(includeTeams);

    const sorted = [...playerStats]
        .filter(d => d.comebackGames.length > 0)
        .sort((a, b) => b.comebackGames.length - a.comebackGames.length);

    const biggestComeback = [...playerStats]
        .flatMap(d => d.comebackGames.map(c => ({ ...c, playerName: d.name })))
        .sort((a, b) => b.deficit - a.deficit)[0];

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
                <strong>Comeback</strong> — registreras när en spelare vinner ett spel trots att ha legat på sista plats
                under spelets gång. Ju större poängunderlaget var, desto mer imponerande comeback.
            </div>

            {biggestComeback && (
                <div style={{
                    marginBottom: "30px",
                    padding: "16px",
                    backgroundColor: "#e3f2fd",
                    borderRadius: "8px",
                    border: "1px solid #90caf9",
                }}>
                    <h3 style={{ margin: "0 0 8px 0" }}>
                        Största comebacken
                    </h3>
                    <div style={{ fontSize: "1.2em" }}>
                        <strong>{biggestComeback.playerName}</strong> — vände {biggestComeback.deficit} poängs underläge till vinst
                        {" "}(spel #{biggestComeback.gameIndex + 1})
                    </div>
                </div>
            )}

            {sorted.length === 0 && (
                <p style={{ fontStyle: "italic" }}>Inga comebacks registrerade.</p>
            )}

            {sorted.map((data) => (
                <div key={data.id} style={{ marginBottom: "20px" }}>
                    <h3 style={{ marginBottom: "4px" }}>{data.name}</h3>
                    <div style={{ marginBottom: "8px", color: "#666" }}>
                        Totalt: {data.comebackGames.length} comebacks
                    </div>
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        alignItems: "center",
                    }}>
                        {data.comebackGames.map((c) => {
                            if (includeTeams && c.isTeam && data.isPlayer()) return null;
                            const size = Math.min(20 + c.deficit / 10, 48);
                            return (
                                <Tooltip
                                    key={c.comebackIndex}
                                    title={`Spel #${c.gameIndex + 1}: Vände ${c.deficit} poängs underläge från sista plats`}
                                >
                                    <TrendingUpIcon
                                        style={{
                                            fontSize: size,
                                            color: "#1976d2",
                                            opacity: c.isTeam ? 0.5 : 1,
                                        }}
                                    />
                                </Tooltip>
                            );
                        })}
                    </div>
                </div>
            ))}
            {sorted.length > 0 && (
                <div style={{ fontStyle: "italic", paddingTop: "20px", color: "#666" }}>
                    Comeback = vann spelet trots att ha legat sist. Halvtransparenta ikoner är från lagspel.
                </div>
            )}
        </div>
    );
};

export default ComebackChart;
