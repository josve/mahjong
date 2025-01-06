import { auth } from "@/auth";
import {getAllUpcomingGames} from "@/lib/db/upcomingGame";
import AdminUpcomingGamesPage from "@/components/upcomingGames/AdminUpcomingGamesPage";

export default async function UpcomingGames() {
    const session = await auth();

    if (!session || !session.user) {
        return <p>Du måste vara inloggad för att se denna sida.</p>;
    }

    const upcomingGames = await getAllUpcomingGames();

    return (
        <AdminUpcomingGamesPage session={session}
                             upcomingGames={upcomingGames}/>
    );
}
