"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";

export default function Home() {
  const { route } = useAuthenticator((context) => [context.route]);

  useEffect(() => {
    if (route === "authenticated") {
      window.location.href = "/inbox";
    }
  });
}
