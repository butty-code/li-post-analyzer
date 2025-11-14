/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "script-src 'self'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data:",
              "connect-src 'self'",
              "font-src 'self' data:",
              "media-src 'self'",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "frame-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
