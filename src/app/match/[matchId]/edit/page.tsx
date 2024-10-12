import { getMatchById, getHandsByGameId } from "@/lib/dbMatch";
import RoundResultForm from "@/components/RoundResultForm";

interface PageProps {
  params: {
    matchId: string;
  };
}

export default async function EditPage({ params }: PageProps) {
  const match = await getMatchById(params.matchId);
  const hands = await getHandsByGameId(params.matchId);

  return (
    <div style={{ backgroundColor: "rgb(250, 250, 250)", padding: "20px" }}>
      <h1 style={{ color: "#943030", fontFamily: "HelveticaNeueLight, Helvetica, tahoma, arial", fontSize: "42px" }}>
        Korrigera resultat för {match.NAME}
      </h1>
      <RoundResultForm hands={hands} matchId={params.matchId} isEditMode={true} />
    </div>
  );
}
