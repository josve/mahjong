import { auth } from "@/auth";
import ProfilePageClient from "@/components/profile/ProfilePageClient";
import { getTeamDetails, getPlayerColors } from "@/lib/dbMatch";

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user) {
    return <p>Du måste vara inloggad för att se denna sida.</p>;
  }

  const teamDetails = await getTeamDetails();
  const playerColors = await getPlayerColors();

  return (
    <ProfilePageClient session={session}
                       playerColors={playerColors}
                       teamDetails={teamDetails} />
  );
}
