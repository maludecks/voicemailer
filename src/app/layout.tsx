import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import outputs from "@root/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import AuthenticatorWrapper from "../components/auth/authenticator-wrapper";
import Header from "../components/header";

Amplify.configure(outputs);

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Voicemailer.io",
  description: "Bringing voicemails back to life",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} bg-[#ffdfe7] h-full flex flex-col`}>
        <AuthenticatorWrapper>
          <Header />
          {children}
        </AuthenticatorWrapper>
      </body>
    </html>
  );
}
