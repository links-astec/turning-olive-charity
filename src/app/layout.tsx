import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { siteInfo } from "@/lib/content";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const siteUrl = "https://turningolive.org";
const description =
  "Turning Olive Charity (formerly Olive Charity) helps underprivileged children and communities in Ghana through clothing distribution and baking skills workshops — impacting the world in our own small ways.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Turning Olive Charity",
    template: "%s | Turning Olive Charity",
  },
  description,
  keywords: [
    "Turning Olive Charity",
    "Olive Charity",
    "Turning Olive",
    "charity Ghana",
    "NGO Accra",
    "Ghana charity",
    "clothing donation Ghana",
    "baking skills workshop Ghana",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: siteInfo.name,
    title: "Turning Olive Charity",
    description,
    images: [
      {
        url: "/images/anniversary-celebration.jpg",
        width: 1200,
        height: 800,
        alt: "Turning Olive Charity community celebration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Turning Olive Charity",
    description,
    images: ["/images/anniversary-celebration.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "ecBVFDjj8RiKk1YQm85CjE4GLcA7N0ej64PVUnzeqP0",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Olive Charity",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#363b25",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: siteInfo.name,
    alternateName: siteInfo.shortName,
    url: siteUrl,
    logo: `${siteUrl}/logo-icon.png`,
    description,
    email: siteInfo.email,
    telephone: siteInfo.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "La, Accra",
      addressCountry: "GH",
    },
    sameAs: ["https://www.instagram.com/olive.charity_2025"],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-cream-100 text-olive-950">{children}</body>
    </html>
  );
}
