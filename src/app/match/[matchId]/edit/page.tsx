import { getMatchById, getHandsByGameId } from "@/lib/dbMatch";
import MatchChart from "@/components/match/matchChart";
import RegisterResultControls from "@/components/match/RegisterResultControls";
import MatchHeader from "@/components/match/MatchHeader";
import { Metadata } from "next";

interface PageProps {
  params: {
    matchId: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const match = await getMatchById(params.matchId);
  return {
    title: `${match.NAME} - Mahjong Master System`,
  };
}

export default async function Page({ params }: PageProps) {
  const hands = await getHandsByGameId(params.matchId);
  const numRounds = Math.floor(hands.length / 4 - 1);
  return (
    <>
      <MatchHeader
        matchId={params.matchId}
        numRounds={numRounds}
      />
      <MatchChart matchId={params.matchId} />
      <RegisterResultControls matchId={params.matchId} />
    </>
  );
}
