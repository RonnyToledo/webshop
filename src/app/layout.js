import "./globals.css";
import Navbar from "@/components/BoltComponent/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="flex justify-center">
        <div className="max-w-lg w-full overflow-hidden">
          <Navbar>{children}</Navbar>
        </div>
      </body>
    </html>
  );
}
