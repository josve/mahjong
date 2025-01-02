import { getTotalStatistics } from "@/lib/dbMatch";

export default async function TotalStatisticsRow() {
    const stats = await getTotalStatistics();

    return (
        <div className="label">
            <p>
                Totalt {stats?.totalMatches} matcher, {stats?.totalMahjongs} mahjonger
                på {stats?.totalRounds - stats?.totalMatches} omgångar
            </p>
        </div>
    );
}
