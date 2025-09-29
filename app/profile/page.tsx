import ProfilePage from "@/components/pagess/Profile";
import React from "react";

// Metadata for the page
export const metadata = {
  title: "Profile - Emiho",
  description: "View and manage your Emiho account profile, settings, and preferences.",
  keywords: ["Emiho", "Profile", "Account", "Settings", "User"],
  authors: [{ name: "Emiho Team", url: "https://emiho.org" }],
  openGraph: {
    title: "Profile - Emiho",
    description: "View and manage your Emiho account profile, settings, and preferences.",
    url: "https://emiho.org/profile",
    siteName: "Emiho",
    images: [
      {
        url: "https://emiho.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Emiho Profile Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <ProfilePage />
    </div>
  );
};

export default page;
