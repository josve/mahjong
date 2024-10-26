import MatchChartClient from "@/components/match/matchChartClient";

interface PageProps {
  matchId: string;
}

export default async function MatchChart({ matchId }: PageProps) {
  return <MatchChartClient matchId={matchId} />;
}
