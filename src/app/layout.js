import "./globals.css";
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("@/components/BoltComponent/Navbar"), {
  ssr: false,
});
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex items-center flex-col">
        <div className="max-w-lg w-full">
          <Navbar>{children}</Navbar>
        </div>
      </body>
    </html>
  );
}
