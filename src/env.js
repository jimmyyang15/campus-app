import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    // AUTH_SECRET:
    //   process.env.NODE_ENV === "production"
    //     ? z.string()
    //     : z.string().optional(),
    // NEXTAUTH_URL: z.preprocess(
    //   // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    //   // Since NextAuth.js automatically uses the VERCEL_URL if present.
    //   (str) => process.env.VERCEL_URL ?? str,
    //   // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    //   process.env.VERCEL ? z.string() : z.string().url(),
    // ),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    RESEND_API_KEY: z.string(),
    JWT_SECRET: z.string(),
    WEB_PUSH_PRIVATE_KEY: z.string(),
    WEB_PUSH_EMAIL: z.string(),
    EMAIL_TEST_PSWD: z.string(),
    EMAIL_TEST: z.string(),
    BASE_URL:z.string()
    // STREAM_SECRET:z.string()
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_VAPID_KEY: z.string(),
    // NEXT_PUBLIC_STREAM_KEY:z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    // AUTH_SECRET: process.env.AUTH_SECRET,
    // NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_VAPID_KEY: process.env.NEXT_PUBLIC_VAPID_KEY,
    WEB_PUSH_PRIVATE_KEY: process.env.WEB_PUSH_PRIVATE_KEY,
    WEB_PUSH_EMAIL: process.env.WEB_PUSH_EMAIL,
    EMAIL_TEST_PSWD: process.env.EMAIL_TEST_PSWD,
    EMAIL_TEST:process.env.EMAIL_TEST
    // STREAM_SECRET:process.env.STREAM_SECRET,
    // NEXT_PUBLIC_STREAM_KEY:process.env.NEXT_PUBLIC_STREAM_KEY
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
