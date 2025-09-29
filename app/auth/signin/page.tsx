import SignInPage from "@/components/pagess/SignIn";
import React from "react";

// Metadata for the page
export const metadata = {
  title: "Sign In - Emiho",
  description: "Sign in to your Emiho account to access all features and manage your profile.",
  keywords: ["Emiho", "Sign In", "Login", "User Account"],
  authors: [{ name: "Emiho Team", url: "https://emiho.org" }],
  openGraph: {
    title: "Sign In - Emiho",
    description: "Sign in to your Emiho account to access all features and manage your profile.",
    url: "https://emiho.org/signin",
    siteName: "Emiho",
    images: [
      {
        url: "https://emiho.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Emiho Sign In",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <SignInPage />
    </div>
  );
};

export default page;
