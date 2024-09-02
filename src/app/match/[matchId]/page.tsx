import { getMatchById, getHandsByGameId, getTeamIdToName } from "@/lib/dbMatch";

interface PageProps {
  params: {
    matchId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const match = await getMatchById(params.matchId);
  const hands = await getHandsByGameId(params.matchId);
  const teamIdToName = await getTeamIdToName();

  const numRounds = Math.floor(hands.length / 4 - 1);

  return (
    <>
      <h1>Match: {match.NAME}</h1>
      <h2>Datum {new Date(match.TIME).toLocaleDateString()}</h2>
      <h2>{numRounds} omgångar</h2>
      <div></div>
    </>
  );
}
