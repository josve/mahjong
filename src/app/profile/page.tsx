import { auth } from "@/auth";
import ProfilePageClient from "@/components/profile/ProfilePageClient"

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user) {
    return <p>Du måste vara inloggad för att se denna sida.</p>;
  }

  return (
    <ProfilePageClient session={session}/>
  );
}
