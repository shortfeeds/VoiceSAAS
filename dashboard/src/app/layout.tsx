import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trinity Pixels | AI Voice Receptionist SaaS",
  description: "Next-gen multi-tenant AI voice receptionist platform. Automate your front desk with human-like AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
