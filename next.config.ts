import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hides the floating Next.js dev badge in the corner. Dev-only UI. It never
  // shipped to production. But it sits on top of the page while you're
  // designing, so it's off.
  devIndicators: false,
};

export default nextConfig;
