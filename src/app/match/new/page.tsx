import { Metadata } from "next";
import NewMatchClient from "@/components/newMatchClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("app.pageTitle", { title: t("match.newMatchTitle") }),
  };
}

export default async function NewMatchPage() {
  return <NewMatchClient />;
}
