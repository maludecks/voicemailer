import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthenticatorWrapper from "@/components/authenticator-wrapper";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "@/../amplify_outputs.json";
import LogoutButton from "@/components/logout-button";

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
          <main className="flex min-h-screen flex-col items-center p-24">
            <LogoutButton />
            {children}
          </main>
        </AuthenticatorWrapper>
      </body>
    </html>
  );
}
