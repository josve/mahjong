import {
  getMatchById,
  getHandsByGameId,
  getTeamIdToName,
  getTeamColors,
} from "@/lib/dbMatch";
import MatchChartClient from "@/components/match/matchChartClient";
import RegisterResultControls from "@/components/match/RegisterResultControls";

interface PageProps {
  hands: any[];
}

export default async function Page({ hands }: PageProps) {
  // const match = await getMatchById(params.matchId);
  //  const hands = await getHandsByGameId(params.matchId);
  //  const teamIdToName = await getTeamIdToName();
  //  const teamColors = await getTeamColors();
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
