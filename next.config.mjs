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
    ],
  },
};

export default nextConfig;
