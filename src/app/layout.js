import "./globals.css";
import Navbar from "@/components/BoltComponent/Navbar";

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
