import React from "react";
import {MahjongStats} from "@/lib/statistics";
import {useTranslations} from "next-intl";

interface WindStatsChartProps {
    stats: MahjongStats;
    readonly includeTeams: boolean;
}

const WINDS = [
    { key: "E" },
    { key: "N" },
    { key: "W" },
    { key: "S" },
] as const;

const WindStatsChart: React.FC<WindStatsChartProps> = ({ stats, includeTeams }) => {
    const t = useTranslations();
    const playerStats = stats.getDataToShow(includeTeams)
        .filter(d => d.numHands > 0);

    return (
        <div style={{ paddingTop: "20px", overflowX: "auto" }}>
            <div style={{
                marginBottom: "20px",
                padding: "12px 16px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                color: "#555",
                lineHeight: 1.5,
            }}>
                <strong>{t("statistics.wind.title")}</strong> — {t("statistics.wind.description")}
            </div>

            {playerStats.length === 0 && (
                <p style={{ fontStyle: "italic" }}>{t("statistics.wind.noData")}</p>
            )}

            {playerStats.length > 0 && (
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.95em",
                }}>
                    <thead>
                        <tr style={{ borderBottom: "2px solid #ddd" }}>
                            <th style={{ textAlign: "left", padding: "8px 12px" }}>{t("common.player")}</th>
                            {WINDS.map(w => (
                                <th key={w.key} style={{ textAlign: "center", padding: "8px 12px" }}>
                                    {t(`common.winds.${w.key}`)}
                                </th>
                            ))}
                            <th style={{ textAlign: "center", padding: "8px 12px" }}>{t("common.total")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playerStats.map((data) => {
                            const totalWins = WINDS.reduce((sum, w) => sum + data.windWins[w.key], 0);
                            const totalHands = WINDS.reduce((sum, w) => sum + data.windHands[w.key], 0);

                            const windRates = WINDS.map(w => {
                                const hands = data.windHands[w.key];
                                const wins = data.windWins[w.key];
                                return hands > 0 ? (wins / hands) * 100 : null;
                            });

                            const validRates = windRates.filter((r): r is number => r !== null);
                            const maxRate = validRates.length > 0 ? Math.max(...validRates) : null;

                            return (
                                <tr key={data.id} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: "8px 12px", fontWeight: "bold" }}>
                                        {data.name}
                                    </td>
                                    {WINDS.map((w, i) => {
                                        const rate = windRates[i];
                                        const hands = data.windHands[w.key];
                                        const wins = data.windWins[w.key];
                                        const isBest = rate !== null && rate === maxRate && rate > 0;
                                        return (
                                            <td key={w.key} style={{
                                                textAlign: "center",
                                                padding: "8px 12px",
                                                backgroundColor: isBest ? "#e8f5e9" : undefined,
                                                fontWeight: isBest ? "bold" : undefined,
                                            }}>
                                                {rate !== null ? (
                                                    <>
                                                        {rate.toFixed(1)}%
                                                        <div style={{ fontSize: "0.8em", color: "#999" }}>
                                                            {wins}/{hands}
                                                        </div>
                                                    </>
                                                ) : "—"}
                                            </td>
                                        );
                                    })}
                                    <td style={{ textAlign: "center", padding: "8px 12px" }}>
                                        {totalHands > 0 ? (
                                            <>
                                                {((totalWins / totalHands) * 100).toFixed(1)}%
                                                <div style={{ fontSize: "0.8em", color: "#999" }}>
                                                    {totalWins}/{totalHands}
                                                </div>
                                            </>
                                        ) : "—"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            <div style={{ fontStyle: "italic", paddingTop: "20px", color: "#666" }}>
                {t("statistics.wind.footnote")}
            </div>
        </div>
    );
};

export default WindStatsChart;
