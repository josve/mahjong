import { getTotalStatistics } from "@/lib/dbMatch";
import { getTranslations } from "next-intl/server";

export default async function TotalStatisticsRow() {
    const stats = await getTotalStatistics();
    const t = await getTranslations("matches");

    return (
        <div className="label">
            <p>
                {t("totalStatistics", {
                    matches: stats?.totalMatches,
                    mahjongs: stats?.totalMahjongs,
                    rounds: stats?.totalRounds - stats?.totalMatches,
                })}
            </p>
        </div>
    );
}
