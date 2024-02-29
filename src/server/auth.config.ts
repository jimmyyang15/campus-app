
// import type { NextAuthConfig } from 'next-auth'
// import GoogleProvider from "@auth/core/providers/google"
// // import google from "next-auth/providers/google";
// import { env } from "@/env";

// export default {
//     providers: [

//         GoogleProvider({
//             clientId: env.GOOGLE_CLIENT_ID,
//             clientSecret: env.GOOGLE_CLIENT_SECRET
//         }),
//         // Credentials({
//         //   async authorize(credentials) {
//         //     const validatedFields = LoginSchema.safeParse(credentials);
//         //     if (validatedFields.success) {
//         //       const { email, password } = validatedFields.data;

//         //       const user = await getUserByEmail(email);
//         //       if (!user || !user.password) return null;

//         //       const passwordMatch = await bcrypt.compare(password, user.password);

//         //       if (passwordMatch) return user;
//         //     }
//         //     return null;
//         //   },
//         // }),
//     ],
// } satisfies NextAuthConfig;

// import { env } from "@/env"
// import Auth from "@auth/core"
// import Google from "@auth/core/providers/google"

// const request = new Request(origin)
// const response = await Auth(request, {
//   providers: [Google({ clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET })],
// })