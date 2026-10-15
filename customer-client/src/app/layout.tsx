import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConnectedShell } from "@/components/nav/ConnectedShell";
import { DashboardProvider } from "@/context/DashboardContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Spending Insights", template: "%s · Spending Insights" },
  description: "Customer spending analytics dashboard",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <DashboardProvider>
          <ConnectedShell>{children}</ConnectedShell>
        </DashboardProvider>
      </body>
    </html>
  );
}
