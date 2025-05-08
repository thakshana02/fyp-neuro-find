import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
          <Navbar />
          <main className="">{children}</main>
          <Footer />
      </body>
    </html>
  );
}
