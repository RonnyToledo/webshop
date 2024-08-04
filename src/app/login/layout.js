import { Toaster } from "@/components/ui/toaster";
import { createClient } from "@/lib/supabase";

export const metadata = {
  title: "Login",
  description: "Login R&H",
  openGraph: {
    title: "Login",
    description: "Login R&H",
    images: [
      "https://res.cloudinary.com/dbgnyc842/image/upload/v1721753647/kiphxzqvoa66wisrc1qf.jpg",
    ],
  },
};

export default function RootLayout({ children }) {
  const supabase = createClient();

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      router.push("/admin/");
    }
  });
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
