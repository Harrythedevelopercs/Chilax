import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "./context/CartContext";

export const metadata: Metadata = {
  title: "Parcela® - Custom Packaging & Custom Boxes | Request a Free Quote",
  description:
    "Order personalized, high-quality custom printed packaging and branded boxes your customers will love. 3,000+ brands trust Parcela for custom boxes, bags, pouches and more.",
  keywords: "custom packaging, custom boxes, custom printed packaging, branded boxes, packaging manufacturer",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@100..1000&display=swap" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/google-sans" rel="stylesheet" />
      </head>
      <body className="antialiased text-[#1a1a2e] bg-[#f1f5f9]" suppressHydrationWarning>
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0CY4QFS1VM"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0CY4QFS1VM');
          `}
        </Script>
        <CartProvider>
          <div className="w-full bg-white min-h-screen overflow-x-hidden border-x border-gray-200/50 shadow-sm" suppressHydrationWarning>
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
