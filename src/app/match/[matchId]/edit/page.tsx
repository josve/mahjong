import { getMatchById } from "@/lib/dbMatch";
import MatchChart from "@/components/match/matchChart";
import RegisterResultControls from "@/components/match/RegisterResultControls";
import { Metadata } from "next";
import {auth} from "@/auth";

interface PageProps {
  readonly params: Promise<{
    readonly matchId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { matchId } = await params;
  const match = await getMatchById(matchId);
  return {
    title: `${match.NAME} - Mahjong Master System`,
  };
}

export default async function Page({ params }: PageProps) {
  const { matchId } = await params;
    if (process.env.REQUIRE_LOGIN) {
        const session = await auth();

        if (!session || !session.user) {
            return <p>Du måste vara inloggad för att se denna sida.</p>;
        }
    }

  return (
    <>
      <MatchChart
        matchId={matchId}
        autoReload={false}
        isEditable={true}
      />
      <RegisterResultControls matchId={matchId} />
    </>
  );
}
