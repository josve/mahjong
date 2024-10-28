import { getMatchById } from "@/lib/dbMatch";
import MatchChart from "@/components/match/matchChart";
import RegisterResultControls from "@/components/match/RegisterResultControls";
import { Metadata } from "next";

interface PageProps {
  readonly params: {
    readonly matchId: string;
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
  return (
    <>
      <MatchChart
        matchId={params.matchId}
        autoReload={false}
      />
      <RegisterResultControls matchId={params.matchId} />
    </>
  );
}
