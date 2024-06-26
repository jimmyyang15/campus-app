// import { PrismaAdapter } from "@auth/prisma-adapter";
// import {
//   getServerSession,
//   type DefaultSession,
//   type NextAuthOptions,
// } from "next-auth";
// import { type Adapter } from "next-auth/adapters";
// import GoogleProvider from "@auth/core/providers/google"
// import { env } from "@/env";
// import { db } from "@/server/db";
// import type { OIDCConfig,OAuth2Config } from "@auth/core/providers"
// import Google from "@auth/core/providers/google"
// /**
//  * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
//  * object and keep type safety.
//  *
//  * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
//  */
// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       // ...other properties
//       // role: UserRole;
//     } & DefaultSession["user"];
//   }

//   // interface User {
//   //   // ...other properties
//   //   // role: UserRole;
//   // }
// }

// /**
//  * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
//  *
//  * @see https://next-auth.js.org/configuration/options
//  */
// export const authOptions: NextAuthOptions = {
//   callbacks: {
//     session: ({ session, user }) => ({
//       ...session,
//       user: {
//         ...session.user,
//         id: user.id,
//       },
//     }),
//   },
//   adapter: PrismaAdapter(db) as Adapter,
//   providers: [
//     Google({
//       clientId:env.GOOGLE_CLIENT_ID,
//       clientSecret:env.GOOGLE_CLIENT_SECRET,

//     })
//     /**
//      * ...add more providers here.
//      *
//      * Most other providers require a bit more work than the Discord provider. For example, the
//      * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
//      * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
//      *
//      * @see https://next-auth.js.org/providers/github
//      */
//   ],
// };

// /**
//  * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
//  *
//  * @see https://next-auth.js.org/configuration/nextjs
//  */
// export const getServerAuthSession = () => getServerSession(authOptions);
import {  Lucia, Session, User } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";
import {  Club, Profile, Request } from "@prisma/client";
import { adapter } from "./adapter";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      // email_verified: boolean;
      profile: Profile;
      googleId: string;
      username: string;
      role: string;
      isMentor:boolean;
      club:Club;
      request:Request
    };
  }
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    }
  },
  getUserAttributes: (attributes) => {
    return {
      googleId: attributes.googleId,
      request:attributes.request,
      username: attributes.username,
      profile: attributes.profile,
      club: attributes.club,
      email: attributes.email,
      role: attributes.role,
      isMentor: attributes.isMentor,
    }
  }
});

// export const google = new Google(
//   process.env.GOOGLE_CLIENT_ID!,
//   process.env.GOOGLE_CLIENT_SECRET!,
//   'https://localhost:3000/auth/signin/google/callback'
// );

export const validateRequest = cache(
  async () => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) return null;
    const { user, session } = await lucia.validateSession(sessionId);
    try {
      if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
    } catch {
      // Next.js throws error when attempting to set cookies when rendering page
    }
    return user;
  }
);



