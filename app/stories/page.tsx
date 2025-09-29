import StoriesPage from "@/components/pagess/Stories";
import React from "react";

// Metadata for the page
export const metadata = {
  title: "Stories - Emiho",
  description: "Read and share inspiring stories from the Emiho community.",
  keywords: ["Emiho", "Stories", "Community", "Inspiration", "Sharing"],
  authors: [{ name: "Emiho Team", url: "https://emiho.org" }],
  openGraph: {
    title: "Stories - Emiho",
    description: "Read and share inspiring stories from the Emiho community.",
    url: "https://emiho.org/stories",
    siteName: "Emiho",
    images: [
      {
        url: "https://emiho.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Emiho Stories",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <StoriesPage />
    </div>
  );
};

export default page;
