import {
  getMatchById,
  getHandsByGameId,
} from "@/lib/dbMatch";
import MatchGridItemClient from "@/components/matches/MatchGridItemClient";

interface Props {
    readonly id: string;
}

export default async function MatchGridItem({ id }: Props) {
    const match = await getMatchById(id);
    const hands = await getHandsByGameId(id);

  return (
      <MatchGridItemClient match={match} hands={hands} id={id} />
  );
}
