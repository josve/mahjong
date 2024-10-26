import { getTeamIdToName, getTeamColors } from "@/lib/dbMatch";
import MatchChartClient from "@/components/match/matchChartClient";

interface PageProps {
  hands: any[];
}

export default async function MatchChart({ hands }: PageProps) {
  const teamIdToName = await getTeamIdToName();
  const teamColors = await getTeamColors();

  return (
    <MatchChartClient
      hands={hands}
      teamIdToName={teamIdToName}
      teamColors={teamColors}
    />
  );
}
