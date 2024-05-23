"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import awsExports from "@root/amplify_outputs.json";

Amplify.configure(awsExports);

export default function CustomAuthenticator({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Authenticator signUpAttributes={["preferred_username", "email"]}>
        {({ signOut, user }) => <div>{children}</div>}
      </Authenticator>
    </div>
  );
}
