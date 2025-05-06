import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from './contexts/AuthContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="">{children}</main>
          <Footer />
      </AuthProvider>
      </body>
    </html>
  );
}
