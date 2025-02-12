import { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            SHOW_PREVIOUS_ROUND_SCORE: boolean;
            PLAYER_ID: string;
            NAME: string;
            COLOR_RED: number;
            COLOR_GREEN: number;
            COLOR_BLUE: number;
            IS_TEST: boolean;
            userColor: string;
            name: string;
            playerId: string;
            firstInitial: string;
        } & DefaultSession["user"]
    }
}