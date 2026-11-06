import { auth } from "@/auth";
import { getTranslations } from "next-intl/server";
import {getAllUpcomingGames} from "@/lib/db/upcomingGame";
import AdminUpcomingGamesPage from "@/components/upcomingGames/AdminUpcomingGamesPage";

export default async function UpcomingGames() {
    const session = await auth();

    const t = await getTranslations("common");

    if (!session || !session.user) {
        return <p>{t("mustBeLoggedIn")}</p>;
    }

    const upcomingGames = await getAllUpcomingGames();

    return (
        <AdminUpcomingGamesPage session={session}
                             upcomingGames={upcomingGames}/>
    );
}
