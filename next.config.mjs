// @ts-nocheck
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import withPWAInit from "@ducanh2912/next-pwa";
const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav:true,
  aggressiveFrontEndNavCaching:true,
  reloadOnOnline:true,
  swcMinify:true,
  disable:false,
  workboxOptions:{
    disableDevLogs:true
  }
});

// const withPWA = require("@ducanh2912/next-pwa").default({
// 	dest: 'public',
// 	cacheOnFrontEndNav : true,
// 	aggresiveFrontEndNavCaching : true,
// 	reloadOnOnline : true,
// 	swcMinify : true,
// 	disable : false,
// 	workboxOptions: {
// 	  disableDevLogs: true,
// 	}
//   });

/** @type {import("next").NextConfig} */
const config = {
  webpack: (config) => {
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    return config;
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

export default withPWA(config)
