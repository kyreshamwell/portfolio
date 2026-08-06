import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hides the floating Next.js dev badge in the corner. Dev-only UI — it never
  // shipped to production — but it sits on top of the page while you're
  // designing, so it's off.
  devIndicators: false,
};

export default nextConfig;
