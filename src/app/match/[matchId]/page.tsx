import { getMatchById, getHandsByGameId } from "@/lib/dbMatch";
import MatchChart from "@/components/match/matchChart";
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
  const match = await getMatchById(params.matchId);
  const hands = await getHandsByGameId(params.matchId);
  const numRounds = Math.floor(hands.length / 4 - 1);

  const matchDate = new Date(match.TIME);
  const isEditable =
    new Date().getTime() - matchDate.getTime() < 24 * 60 * 60 * 1000;

  return (
    <>
      <MatchHeader
        matchId={params.matchId}
        numRounds={numRounds}
      />
      <MatchChart matchId={params.matchId} />
      {isEditable && (
        <div style={{ marginTop: "20px" }}>
          <a
            href={`/match/${params.matchId}/edit`}
            style={{
              textDecoration: "underline",
            }}
          >
            Till registrerings sida
          </a>
        </div>
      )}
    </>
  );
}
