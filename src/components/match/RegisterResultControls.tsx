import { getMatchById, getTeamIdToName } from "@/lib/dbMatch";
import RoundResultFormAdd from "@/components/match/RoundResultFormAdd";

interface Props {
  matchId: string;
}

export default async function RegisterResultControls({ matchId }: Props) {
  const match = await getMatchById(matchId);
  const teamIdToName = await getTeamIdToName();
  const relevantTeamIds = [
    match.TEAM_ID_1,
    match.TEAM_ID_2,
    match.TEAM_ID_3,
    match.TEAM_ID_4,
  ];
  const relevantTeams: any = Object.fromEntries(
    Object.entries(teamIdToName).filter(([teamId]) =>
      relevantTeamIds.includes(teamId)
    )
  );

  const matchDate = new Date(match.TIME);
  const isEditable =
    new Date().getTime() - matchDate.getTime() < 24 * 60 * 60 * 1000;

  return (
    <>
      {isEditable ? (
        <>
          <RoundResultFormAdd
            teamIdToName={relevantTeams}
            matchId={matchId}
          />
          <div style={{ marginTop: "20px" }}>
            <a
              href={`/match/${matchId}/correct`}
              style={{
                textDecoration: "underline",
              }}
            >
              Korrigera resultat
            </a>
          </div>
        </>
      ) : (
        <p
          style={{
            color: "var(--grey-color)",
            textAlign: "center",
          }}
        >
          Matchen är för gammal för att göra ändringar.
        </p>
      )}
    </>
  );
}