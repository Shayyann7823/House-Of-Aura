import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "House of Aura — Pakistani Luxury Clothing & Accessories",
  description:
    "House of Aura is a modern Pakistani clothing house — eastern & western wear for women, men and kids, plus jewellery, perfumes and accessories.",
  authors: [{ name: "House of Aura" }],
  openGraph: {
    title: "House of Aura — Pakistani Luxury Clothing & Accessories",
    description: "Timeless Pakistani craft, modern silhouettes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Karla:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}