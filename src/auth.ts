import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import Google from "next-auth/providers/google"
import Connection from "@/lib/connection";

function getProviders() {
    const providers = [];

    if (!!process.env.AUTH_GOOGLE_ID) {
        providers.push(Google);
    }

    if (!!process.env.DEV_MOCK_PWD) {
        // For testing allow people to login with a mock password
        const credentials = Credentials({
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials: any) => {
                let user = null;
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
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const connection = await Connection.getInstance().getConnection();
      try {
        console.log(user);
        console.log(profile);
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
