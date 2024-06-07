// @ts-nocheck
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// import { createRequire } from "module";
await import("./src/env.js");
import withSerwistInit from "@serwist/next";

// const withPWA = require('next-pwa')({
//   dest: 'public',
// });


const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "src/app/sw.ts",
  disable:false,
  swDest: "public/sw.js",
  reloadOnOnline: true,
});

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverComponentsExternalPackages: [
        '@react-email/components',
        '@react-email/render',
        '@react-email/tailwind'
    ]
},
  webpack: (config) => {
    
    config.module.rules.push({
      test: /\.node/,
      use: 'raw-loader',
    });
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};


export default withSerwist(config);