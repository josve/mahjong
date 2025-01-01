import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import Google from "next-auth/providers/google"
import Connection from "@/lib/connection";
import type {Provider} from "next-auth/providers";
import GitHub from "next-auth/providers/github"

function getProviders(): Provider[] {
    const providers: Provider[] = [];


    if (process.env.AUTH_GITHUB_ID) {
        providers.push(GitHub);
    }

    if (process.env.AUTH_GOOGLE_ID) {
        providers.push(Google);
    }

    if (process.env.DEV_MOCK_PWD) {
        // For testing allow people to login with a mock password
        const credentials = Credentials({
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials: any) => {
                if (process.env.DEV_MOCK_PWD !== credentials.password) {
                    throw new Error("No user found");
                }

                return {
                    email: credentials.email,
                };
            },
        });
        providers.push(credentials);
    }

    return providers;
}


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: getProviders(),
    theme: {
        logo: "/icon.png",
        brandColor: "#753e27"
    },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const connection = await Connection.getInstance().getConnection();
      try {
        const [rows]: any = await connection.query(
          "SELECT * FROM PlayerEmails WHERE EMAIL = ?",
          [user.email]
        );
        if (rows.length > 0 && (profile?.email_verified || process.env.DEV_ALLOW_INSECURE_EMAIL)) {
          return true;
        } else {
          return false;
        }
      } finally {
        connection.release();
      }
    },
    async session({ session, token, user }) {
      const connection = await Connection.getInstance().getConnection();
      try {
        const [rows]: any = await connection.query(
          `SELECT Players.* FROM Players
           INNER JOIN PlayerEmails ON Players.PLAYER_ID = PlayerEmails.PLAYER_ID
           WHERE PlayerEmails.EMAIL = ?`,
          [token.email]
        );
        if (rows.length > 0) {
          const player = rows[0];
          const firstInitial = player.NAME.charAt(0).toUpperCase();
          session.user = {
            ...session.user,
            ...player,
            firstInitial,
            playerId: player.PLAYER_ID,
            name: player.NAME,
            userColor: 'rgb(' + player.COLOR_RED + "," + player.COLOR_GREEN + "," + player.COLOR_BLUE +")", 
          };
        }
        return session;
      } finally {
        connection.release();
      }
    },
  },
});
