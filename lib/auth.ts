import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file"; 
// drive.file = app can create/read files it created or user selected via picker.
// If you want full Drive access (not recommended), use: https://www.googleapis.com/auth/drive

// Only include Google provider if credentials are set
const providers = [];
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            SHEETS_SCOPE,
            DRIVE_SCOPE,
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    })
  );
}

// NextAuth requires at least one provider, so use a dummy one if none are configured
// This prevents NextAuth from throwing errors
if (providers.length === 0) {
  providers.push(
    GoogleProvider({
      clientId: "dummy",
      clientSecret: "dummy",
    })
  );
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "dummy-secret-for-development",
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/", // Redirect sign-in attempts to home
    error: "/", // Redirect errors to home instead of showing error page
  },
  callbacks: {
    async jwt({ token, account }) {
      // First time login: store tokens
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token; // only returned on first consent
        token.accessTokenExpires = Date.now() + (account.expires_at ? account.expires_at * 1000 - Date.now() : 0);
      }
      return token;
    },
    async session({ session, token }) {
      // expose access token to server routes
      (session as { accessToken?: string; refreshToken?: string }).accessToken = token.accessToken as string | undefined;
      (session as { accessToken?: string; refreshToken?: string }).refreshToken = token.refreshToken as string | undefined;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export const handlers = {
  GET: handler,
  POST: handler,
};

// Export auth function for use in API routes and server components
// Per spec: API routes must enforce auth
export async function auth() {
  const { getServerSession } = await import("next-auth");
  return await getServerSession(authOptions);
}

