"use client";

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import awsExports from "@root/amplify_outputs.json";
import { useEffect } from "react";

Amplify.configure(awsExports);

export default function CustomAuthenticator({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Authenticator
      signUpAttributes={["preferred_username", "email"]}
      className="h-screen flex flex-col items-center justify-center"
    >
      {({ signOut, user }) => <>{children}</>}
    </Authenticator>
  );
}
