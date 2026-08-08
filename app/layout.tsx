import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parcela® - Custom Packaging & Custom Boxes | Request a Free Quote",
  description:
    "Order personalized, high-quality custom printed packaging and branded boxes your customers will love. 3,000+ brands trust Parcela for custom boxes, bags, pouches and more.",
  keywords: "custom packaging, custom boxes, custom printed packaging, branded boxes, packaging manufacturer",
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
        <div className="w-full bg-white min-h-screen overflow-x-hidden border-x border-gray-200/50 shadow-sm">
          {children}
        </div>
      </body>
    </html>
  );
}
