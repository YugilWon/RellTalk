import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "image.tmdb.org",
      "vbgtbpmlzcptwhyezzji.supabase.co",
      "lh3.googleusercontent.com",
    ],
  },
};

export default analyzer(nextConfig);
