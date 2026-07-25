import type { Metadata } from "next";
import SiteFooter from "@/app/ui/shared/site-footer";
import SiteHeader from "@/app/ui/shared/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Handcrafted Haven",
    template: "%s | Handcrafted Haven",
  },
  description: "Discover unique products from talented artisans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <SiteHeader />
        <div className="site-content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
