import "./globals.css";
import Navbar from "@/components/BoltComponent/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="max-w-lg w-full overflow-hidden">
          <Navbar>{children}</Navbar>
        </div>
      </body>
    </html>
  );
}
