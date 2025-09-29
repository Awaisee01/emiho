import SignUpPage from "@/components/pagess/SignUp";
import React from "react";

// Metadata for the page
export const metadata = {
  title: "Sign Up - Emiho",
  description: "Create a new Emiho account to access all features and manage your profile.",
  keywords: ["Emiho", "Sign Up", "Register", "User Account"],
  authors: [{ name: "Emiho Team", url: "https://emiho.org" }],
  openGraph: {
    title: "Sign Up - Emiho",
    description: "Create a new Emiho account to access all features and manage your profile.",
    url: "https://emiho.org/signup",
    siteName: "Emiho",
    images: [
      {
        url: "https://emiho.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Emiho Sign Up",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const page = () => {
  return (
    <div>
      <SignUpPage />
    </div>
  );
};

export default page;
