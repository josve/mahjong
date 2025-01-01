import { auth } from "@/auth";
import MatchChartClient from "@/components/match/matchChartClient";
import {getTeamIdToPlayerIds} from "@/lib/dbMatch";

interface PageProps {
  readonly matchId: string;
  readonly autoReload: boolean;
  readonly isEditable: boolean;
}

export default async function MatchChart({ matchId, autoReload, isEditable }: PageProps) {
  const session = await auth();
  const teamIdToPlayerIds = await getTeamIdToPlayerIds();

  return (
    <MatchChartClient
      matchId={matchId}
      isEditable={isEditable}
      autoReload={autoReload}
      playerId={session?.user?.PLAYER_ID}
      teamIdToPlayerIds={teamIdToPlayerIds}
      showPreviousRoundScore={!!session?.user?.SHOW_PREVIOUS_ROUND_SCORE}
    />
  );
}
