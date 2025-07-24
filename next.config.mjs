/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "es"], // Idiomas soportados, puedes agregar más
    defaultLocale: "es", // Idioma por defecto
    localeDetection: false, // No cambies la ruta por el idioma
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Todas las peticiones al optimizador interno de Next.js
        source: "/_next/image/(.*)",
        headers: [
          {
            key: "Cache-Control",
            // 1 año y marcadas como inmutables
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Imágenes que sirvas desde /public (o cualquier ruta .jpg/.png/etc.)
        source: "/:all*(jpg|jpeg|png|svg|webp)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
