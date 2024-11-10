import { auth } from "@/auth";
import ProfilePageClient from "@/components/profile/ProfilePageClient";
import { getTeamDetails } from "@/lib/dbMatch";

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user) {
    return <p>Du måste vara inloggad för att se denna sida.</p>;
  }

  const teamDetails = await getTeamDetails();

  return (
    <ProfilePageClient session={session} teamDetails={teamDetails} />
  );
}
