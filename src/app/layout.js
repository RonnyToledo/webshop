import "./globals.css";
import Navbar from "@/components/BoltComponent/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="flex justify-center bg-gray-100">
        <div className="max-w-md w-full">
          <Navbar>{children}</Navbar>
        </div>
      </body>
    </html>
  );
}
