import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import outputs from "@root/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import AuthenticatorWrapper from "../components/auth/authenticator-wrapper";
import Header from "../components/header";

Amplify.configure(outputs);

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <AuthenticatorWrapper>
          <Header />
          <main className="w-full">{children}</main>
        </AuthenticatorWrapper>
      </body>
    </html>
  );
}
