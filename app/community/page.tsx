import CommunityPage from "@/components/pagess/Community";
import React from "react";

// Metadata for the page
export const metadata = {
  title: "Community - Emiho",
  description: "Join the Emiho community to connect, share, and collaborate with other users.",
  keywords: ["Emiho", "Community", "Forum", "Discussion", "Connect"],
  authors: [{ name: "Emiho Team", url: "https://emiho.org" }],
  openGraph: {
    title: "Community - Emiho",
    description: "Join the Emiho community to connect, share, and collaborate with other users.",
    url: "https://emiho.org/community",
    siteName: "Emiho",
    images: [
      {
        url: "https://emiho.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Emiho Community",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <CommunityPage />
    </div>
  );
};

export default page;
