import type { Metadata } from "next";
import { geistSans, poppins, inter, sfpro } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: {
    template: `%s | pocv`,
    default: "pocv :: a piowsee creation",
  },
  description:
    "Official Website of pocv.",
  keywords: [
    "Landing AI",
  ],
  authors: [{ name: "Vearance", url: process.env.NEXT_BASE_URL }],
  applicationName: "pocv",
  creator: "Vearance",
  publisher: "piowsee.ai",

  openGraph: {
    title: "Landing AI :: a piowsee.ai creation",
    description:
      "Official Website of Landing AI.",
    url: process.env.NEXT_BASE_URL,
    siteName: "Landing AI",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${process.env.NEXT_BASE_URL}/assets/hero.webp`,
        width: 1200,
        height: 630,
        alt: "Landing AI",
      },
    ],
  },
  // TODO: assets link, twitter site, etc.
  twitter: {
    card: "summary_large_image",
    site: "@pocv",
    creator: "@Vearance",
    title: "Landing AI :: a piowsee.ai creation",
    description:
      "Official Website of Landing AI.",
    images: [
      {
        url: `${process.env.NEXT_BASE_URL}/assets/hero.webp`,
        alt: "Landing AI Hero Image",
      },
    ],
  },

  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
    apple: {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  },

  alternates: {
    canonical: process.env.NEXT_BASE_URL,
  },

  metadataBase: new URL(process.env.NEXT_BASE_URL!),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          geistSans.variable,
          poppins.variable,
          inter.variable,
          sfpro.variable,
          sfpro.className,
          'font-normal antialiased',
        )}
      >
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
