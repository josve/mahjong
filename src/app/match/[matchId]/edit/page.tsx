import { getMatchById } from "@/lib/dbMatch";
import MatchChart from "@/components/match/matchChart";
import RegisterResultControls from "@/components/match/RegisterResultControls";
import { Metadata } from "next";
import {auth} from "@/auth";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations("app");
  return {
    title: t("pageTitle", { title: match.NAME }),
  };
}

export default async function Page({ params }: PageProps) {
  const { matchId } = await params;
    if (process.env.REQUIRE_LOGIN) {
        const session = await auth();

        if (!session || !session.user) {
            const t = await getTranslations("common");
            return <p>{t("mustBeLoggedIn")}</p>;
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
