import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import { addHours } from "date-fns";
import { Services } from "@/actions/sdk.gen";
// import { refreshAccessToken } from "@/actions/User";

const axiosInstace = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api/auth/",
});

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const response = await axiosInstace.post(`/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          const { accessToken, refreshToken } = await response.data;

          if (accessToken) {
            // Decode the JWT token
            const decodedToken = jwt.decode(accessToken) as JwtPayload;
            return {
              email: credentials?.email,
              id: decodedToken._id,
              name: decodedToken.full_name,
              profileImg: decodedToken.profileImg,
              verified: decodedToken.verified,
              expiresAt: decodedToken.exp && decodedToken.exp * 1000,
              accessToken,
              refreshToken,
            };
          } else {
            return null;
          }
        } catch (error: any) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              const { status, data } = error.response;
              if (status !== 200) throw new Error(data.message);
            }
          }

          throw new Error("Unable to connect to the server.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
    }: {
      token: JWT;
      user: any;
      trigger?: "signIn" | "update" | "signUp";
    }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.token = user.token;
        token.image = user.profileImg?.url || null;
        token.verified = user.verified;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = user.expiresAt;
      }

      if (trigger === "update") {
        const refreshed = await Services.refreshAccessToken({
          refreshToken: token.refreshToken as string,
          id: token.id,
        });

        // ✅ Merge instead of returning a new object
        token.accessToken = refreshed.accessToken;
        token.refreshToken = refreshed.refreshToken;
        token.expiresAt = refreshed.expiresAt;
        token.email = refreshed.email;
        token.name = refreshed.name;
        token.image = refreshed.profileImg;
        token.verified = refreshed.verified;
      }

      const tokenExpiration = addHours(new Date(token.expiresAt as number), 2);
      const currDate = addHours(new Date(), 2);

      // console.log(
      //   "Token Expiration:",
      //   new Date(tokenExpiration).getTime() > Date.now()
      // );
      if (currDate > tokenExpiration) {
        const refreshed = await Services.refreshAccessToken({
          refreshToken: token.refreshToken as string,
          id: token.id,
        });

        token.accessToken = refreshed.accessToken;
        token.refreshToken = refreshed.refreshToken;
        token.expiresAt = refreshed.expiresAt;
        token.email = refreshed.email;
        token.name = refreshed.name;
        token.image = refreshed.profileImg;
        token.verified = refreshed.verified;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
          image: (token?.image as string) || null,
          name: token.name,
          verified: token.verified,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        };

        // console.log(new Date().toLocaleString());
        console.log(session)
        session.expires = new Date(token.expiresAt as number).toLocaleTimeString();
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// Correctly export as HTTP methods
export { handler as GET, handler as POST };
