import { auth } from "@/auth";
import MatchChartClient from "@/components/match/matchChartClient";

interface PageProps {
  readonly matchId: string;
  readonly autoReload: boolean;
}

export default async function MatchChart({ matchId, autoReload }: PageProps) {
  const session = await auth();

  return (
    <MatchChartClient
      matchId={matchId}
      autoReload={autoReload}
      showPreviousRoundScore={!!session?.user?.SHOW_PREVIOUS_ROUND_SCORE}
    />
  );
}
