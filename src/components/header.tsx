"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "@src/components/auth/logout-button";
import { fetchUserAttributes } from "aws-amplify/auth";

export default function Header() {
  const [username, setUsername] = useState<string>();

  const getUsername = async () => {
    const userAttr = fetchUserAttributes();
    const username = (await userAttr).preferred_username;

    if (username) {
      setUsername(username);
    }
  };

  useEffect(() => {
    getUsername();
  }, []);

  return (
    <nav className="flex items-center bg-white pl-16 pr-16 h-20 border-b-2 shadow">
      <span className="text-gray-800 mr-auto">Voicemailer</span>
      {username && <span className="mr-4">Welcome back, @{username}!</span>}
      <LogoutButton />
    </nav>
  );
}
