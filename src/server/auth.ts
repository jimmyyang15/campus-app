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
import {  Club, Profile } from "@prisma/client";
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
      clubs:Club[];
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
      username: attributes.username,
      profile: attributes.profile,
      clubs: attributes.clubs,
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
  async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
    } catch { }
    return result;
  }
);



