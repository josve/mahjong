import { getTotalStatistics } from "@/lib/dbMatch";

export default async function TotalStatisticsRow() {
  const stats = await getTotalStatistics();

  return (
    <div
      style={{
        color: "var(--grey-color)",
        marginBottom: "20px",
        textAlign: "left",
      }}
    >
      <p>
        Totalt {stats?.totalMatches} matcher,
        {stats?.totalMahjongs} mahjonger på {stats?.totalRounds} omgångar
      </p>
    </div>
  );
}
