import { Metadata } from "next";
import NewMatchClient from "@/components/newMatchClient";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ny match - Mahjong Master System",
  };
}

export default async function NewMatchPage() {
  return <NewMatchClient />;
}
