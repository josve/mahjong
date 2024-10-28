import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Connection from "@/lib/connection";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const connection = await Connection.getInstance().getConnection();
      try {
        const [rows]: any = await connection.query(
          "SELECT * FROM PlayerEmails WHERE EMAIL = ?",
          [email]
        );
        if (rows.length > 0) {
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
          session.user = {
            ...session.user,
            ...rows[0],
          };
        }
        return session;
      } finally {
        connection.release();
      }
    },
  },
});
