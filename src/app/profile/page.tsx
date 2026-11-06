import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";
import ProfilePageClient from "@/components/profile/ProfilePageClient";
import { getTeamDetails, getPlayerColors, getPlayerEmails } from "@/lib/dbMatch";

export default async function ProfilePage() {
  const session = await auth();

  const t = await getTranslations("common");

  if (!session || !session.user) {
    return <p>{t("mustBeLoggedIn")}</p>;
  }

  const teamDetails = await getTeamDetails();
  const playerColors = await getPlayerColors();
  const emails = await getPlayerEmails(session.user.PLAYER_ID);

  return (
    <ProfilePageClient session={session}
                       playerColors={playerColors}
                       teamDetails={teamDetails}
                       emails={emails} />
  );
}
