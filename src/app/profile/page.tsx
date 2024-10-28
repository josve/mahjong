import { auth } from "@/auth"

export default async function ProfilePage() {
  const session = await auth()

  if (!session || !session.user) {
    return <p>Du måste vara inloggad för att se denna sida.</p>;
  }

  const user : any = session.user;

  return (
    <div style={{ backgroundColor: "var(--background-color)", padding: "20px" }}>
      <h1 style={{ color: "var(--header-color)" }}>Profil</h1>
      <p style={{ color: "var(--label_text-color)" }}>Namn: {user?.name}</p>
      <p style={{ color: user?.color }}>Färg</p>
    </div>
  );
}
