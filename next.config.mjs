// @ts-nocheck
await import("./src/env.js");
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({

  swSrc: "src/app/sw.ts",
  disable:false,
  swDest: "public/sw.js",
  reloadOnOnline: true,
});

/** @type {import("next").NextConfig} */
const config = {

  webpack: (config) => {

    config.module.rules.push({
      test: /\.node/,
      use: 'raw-loader',
    });
    return config;
  },
  eslint: {

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

// const {
//   PHASE_DEVELOPMENT_SERVER,
//   PHASE_PRODUCTION_BUILD,
// } = require("next/constants");

// /** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
// module.exports = async (phase) => {
//   /** @type {import("next").NextConfig} */
//   const nextConfig = {

//     webpack: (
//       config,
//     ) => {
      
//       config.plugins = config.plugins || [];
//       config.plugins.push(
//         new NormalModuleReplacementPlugin(
//           /email\/render/,
//           path.resolve(__dirname, "./renderEmailFix.js"),
//         ),
//       );
//       config.module.rules.push({
//         test: /\.node/,
//         use: "raw-loader",
//       });
//       return config;
//     },
//     eslint: {
//       ignoreDuringBuilds: true,
//     },

//     images: {
//       remotePatterns: [
//         {
//           protocol: "https",
//           hostname: "ui-avatars.com",
//           port: "",
//           pathname: "/**",
//         },
//         {
//           protocol: "https",
//           hostname: "files.edgestore.dev",
//           port: "",
//           pathname: "/**",
//         },
//       ],
//     },
//   };

//   if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
//     const withSerwist = (await import("@serwist/next")).default({
//       // Note: This is only an example. If you use Pages Router,
//       // use something else that works, such as "service-worker/index.ts".
//       swSrc: "src/app/sw.ts",
//       swDest: "public/sw.js",
//     });
//     return withSerwist(nextConfig);
//   }

//   return nextConfig;
// };
