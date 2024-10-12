import { getMatchById, getHandsByGameId, getTeamIdToName } from "@/lib/dbMatch";
import RoundResultForm from "@/components/RoundResultForm";

interface PageProps {
  params: {
    matchId: string;
  };
}

export default async function EditPage({ params }: PageProps) {
  const match = await getMatchById(params.matchId);
  const hands = await getHandsByGameId(params.matchId);

  const teamIdToName = (await getTeamIdToName()) || {};
  const relevantTeamIds = [
    match.TEAM_ID_1,
    match.TEAM_ID_2,
    match.TEAM_ID_3,
    match.TEAM_ID_4,
  ];
  const relevantTeams = Object.fromEntries(
    Object.entries(teamIdToName).filter(([teamId]) =>
      relevantTeamIds.includes(teamId)
    )
  );

  return (
    <div style={{ backgroundColor: "rgb(250, 250, 250)", padding: "20px" }}>
      <h1 style={{ color: "#943030", fontFamily: "HelveticaNeueLight, Helvetica, tahoma, arial", fontSize: "42px" }}>
        Korrigera resultat för {match.NAME}
      </h1>
      <RoundResultForm hands={hands} matchId={params.matchId} teamIdToName={relevantTeams} isEditMode={true} />
    </div>
  );
}
