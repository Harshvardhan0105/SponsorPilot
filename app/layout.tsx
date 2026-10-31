import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SponsorPilot | Autonomous Sponsorship Strategy & Outreach",
  description:
    "Autonomous sponsorship strategy for student teams, clubs, and campus events. Grounded need-to-ask matching powered by Crustdata.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
