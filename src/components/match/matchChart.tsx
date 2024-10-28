import MatchChartClient from "@/components/match/matchChartClient";

interface PageProps {
  readonly matchId: string;
  readonly autoReload: boolean;
}

export default async function MatchChart({ matchId, autoReload }: PageProps) {
  return (
    <MatchChartClient
      matchId={matchId}
      autoReload={autoReload}
    />
  );
}
