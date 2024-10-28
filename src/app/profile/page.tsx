import { getSession } from "next-auth/react";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    return <p>Du måste vara inloggad för att se denna sida.</p>;
  }

  const { user }: any = session;
  const { name, color } = user;

  return (
    <div style={{ backgroundColor: "var(--background-color)", padding: "20px" }}>
      <h1 style={{ color: "var(--header-color)" }}>Profil</h1>
      <p style={{ color: "var(--label_text-color)" }}>Namn: {name}</p>
      <p style={{ color: color }}>Färg: {color}</p>
    </div>
  );
}
