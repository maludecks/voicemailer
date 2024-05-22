"use client";

import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function LogoutButton() {
  const { signOut } = useAuthenticator((context) => [context.user]);

  if (!signOut) {
    return null;
  }

  return (
    <span className="underline cursor-pointer" onClick={signOut}>
      Logout
    </span>
  );
}
