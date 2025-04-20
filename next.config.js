/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // allowedDevOrigins is usually for CORS headers *from* this server,
  // not strictly necessary for proxying, but keep it if needed.
  allowedDevOrigins: ['https://9005-idx-studio-1745131497147.cluster-sumfw3zmzzhzkx4mpvz3ogth4y.cloudworkstations.dev'],

  // Add rewrites to proxy /api/genkit requests to the Genkit server (default port 3400)
  async rewrites() {
    return [
      {
        source: '/api/genkit/:path*', // Match any path under /api/genkit/
        // Ensure this destination matches the host and port your Genkit server is running on.
        // Using localhost assumes Genkit runs on the same machine as the Next.js server.
        destination: 'http://localhost:3400/api/genkit/:path*', 
      },
    ]
  },
}

module.exports = nextConfig