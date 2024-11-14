/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      config.module.rules.push({
        test: /\.(mp3)$/i, // Match .mp3 files
        type: 'asset/resource', // This replaces the need for file-loader in modern Webpack
        generator: {
          filename: 'static/assets/[hash][ext]', // Output path for the file
        },
      });
  
      return config;
    },
  };
  
  export default nextConfig;
  