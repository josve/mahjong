import MatchChartClient from "@/components/match/matchChartClient";

interface PageProps {
  matchId: string;
  autoReload: boolean;
}

export default async function MatchChart({ matchId, autoReload }: PageProps) {
  return (
    <MatchChartClient
      matchId={matchId}
      autoReload={autoReload}
    />
  );
}
