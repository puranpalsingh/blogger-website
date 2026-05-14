import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://yourdomain.dev"; // change this

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "devlog/ai — Learning AI by building real projects",
    template: "%s — devlog/ai",  // blog posts become "Post Title — devlog/ai"
  },

  description:
    "An AI/ML learner writing about LLMs, training pipelines, and the messy debugging that happens between idea and deployment. No fluff — just notes from the terminal.",

  keywords: [
    "AI", "ML", "machine learning", "deep learning",
    "LLM", "PyTorch", "NLP", "fine-tuning", "deployment",
  ],

  authors: [{ name: "Puranpal Singh", url: SITE_URL }],
  creator: "Puranpal Singh",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "devlog/ai",
    title: "devlog/ai — Learning AI by building real projects",
    description:
      "An AI/ML learner writing about LLMs, training pipelines, and the messy debugging that happens between idea and deployment.",
    images: [
      {
        url: "/og-image.png", // create a 1200x630 image and put in /public
        width: 1200,
        height: 630,
        alt: "devlog/ai",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "devlog/ai — Learning AI by building real projects",
    description:
      "Notes from building real AI/ML projects — LLMs, training pipelines, deployment.",
    images: ["/og-image.png"],
    // creator: "@yourhandle",  // add when you have a twitter
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}