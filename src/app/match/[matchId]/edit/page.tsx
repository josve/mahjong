import { getMatchById, getHandsByGameId } from "@/lib/dbMatch";
import MatchChart from "@/components/match/matchChart";
import RegisterResultControls from "@/components/match/RegisterResultControls";
import { Metadata } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

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
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [hands, setHands] = useState([]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/deleteGame?matchId=${params.matchId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/matches");
      } else {
        console.error("Failed to delete game");
      }
    } catch (error) {
      console.error("Error deleting game:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchHands = async () => {
      const handsData = await getHandsByGameId(params.matchId);
      setHands(handsData);
    };
    fetchHands();
  }, [params.matchId]);

  return (
    <>
      <MatchChart
        matchId={params.matchId}
        autoReload={false}
      />
      <RegisterResultControls matchId={params.matchId} />
      {hands.length <= 4 && (
        <button onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Raderar..." : "Radera spel"}
        </button>
      )}
    </>
  );
}
