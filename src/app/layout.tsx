import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CV Forge — Professional Resume Builder & CV Maker",
  description:
    "Build stunning, professional CVs in minutes with our free CV builder. Choose from 4 expert templates, customize every detail, and download as PDF or PNG.",
  keywords: ["CV builder", "resume builder", "free CV maker", "professional resume", "CV templates"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
        <Script
          src="https://follow-nest-client.vercel.app/widget.js"
          strategy="afterInteractive"
        />
        <Script id="jotra-widget" strategy="afterInteractive">
          {`JotraWidget.init({
  "apiKey": "fk_04e289f5ec90dc079837cf03aa501e0f0de7febbae3b4286da7b3c93a8880b6e"
});`}
        </Script>
      </body>
    </html>
  );
}
