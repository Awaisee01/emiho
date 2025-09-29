import Pricing from "@/components/pagess/Pricing";
import React from "react";

// Metadata for the page
export const metadata = {
  title: "Pricing - Emiho",
  description: "Explore Emiho's pricing plans and choose the best option to access all features.",
  keywords: ["Emiho", "Pricing", "Plans", "Subscription", "Features"],
  authors: [{ name: "Emiho Team", url: "https://emiho.org" }],
  openGraph: {
    title: "Pricing - Emiho",
    description: "Explore Emiho's pricing plans and choose the best option to access all features.",
    url: "https://emiho.org/pricing",
    siteName: "Emiho",
    images: [
      {
        url: "https://emiho.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Emiho Pricing Plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <Pricing />
    </div>
  );
};

export default page;
