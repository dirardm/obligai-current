// 1. Fonts
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";

// 2. Canonical tokens — never touched
import "../styles/colors_and_type.css";

// 3. Extended stylesheet — the project deliverable
import "../styles/ObligaI_Extended_Stylesheet.css";

import type { Metadata } from "next";
import ThemeBootstrap from "@/components/layout/ThemeBootstrap";

export const metadata: Metadata = {
  title: { default: "ObligaI", template: "%s — ObligaI" },
  description: "Regulatory intelligence for multi-jurisdiction banks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" data-theme="light">
      <body>
        <ThemeBootstrap />
        {children}
      </body>
    </html>
  );
}
