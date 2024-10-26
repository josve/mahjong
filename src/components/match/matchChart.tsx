import MatchChartClient from "@/components/match/matchChartClient";

interface PageProps {
  hands: any[];
}

export default async function MatchChart({ hands }: PageProps) {
  const matchId = "some-match-id"; // Replace with actual matchId

  const response = await fetch(`/api/matchChart?matchId=${matchId}`);
  const data = await response.json();

  return (
    <MatchChartClient
      hands={data.hands}
      teamIdToName={data.teamIdToName}
      teamColors={data.teamColors}
    />
  );
}
