/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  // Include the templates folder in the Vercel/serverless build output
  outputFileTracingIncludes: {
    '/api/documents/generate-zip': ['./templates/**/*'],
    '/api/documents/generate': ['./templates/**/*'],
  },
};

export default nextConfig;
