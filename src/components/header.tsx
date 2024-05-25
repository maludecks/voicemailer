"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "@src/components/auth/logout-button";
import { fetchUserAttributes } from "aws-amplify/auth";
import { Divider, Menu, MenuButton, MenuItem } from "@aws-amplify/ui-react";
import { RxAvatar } from "react-icons/rx";
import { motion } from "framer-motion";
import { FaVoicemail } from "react-icons/fa";
import Link from "next/link";

export default function Header() {
  const [username, setUsername] = useState<string>();

  const getUsername = async () => {
    const userAttr = await fetchUserAttributes();
    const username = userAttr.preferred_username;

    if (username) {
      setUsername(username);
    }
  };

  useEffect(() => {
    getUsername();
  }, []);

  return (
    <nav
      className="flex items-center pl-16 pr-16 h-24 bg-[#feea80] border-black border-b-2"
      aria-label="Main navigation"
    >
      <FaVoicemail size={35} className="mr-auto" aria-label="Voicemail icon" />
      <Menu
        trigger={
          <MenuButton
            className="menu-button"
            size="large"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                type: "spring",
                stiffness: 125,
                delay: 0.5,
                duration: 0.7,
              }}
              aria-label="User avatar"
            >
              <RxAvatar className="avatar-icon" size={25} aria-hidden="true" />
            </motion.span>
          </MenuButton>
        }
        className="main-menu"
        aria-label="User menu"
      >
        <MenuItem>
          <Link
            href={`/${username}`}
            aria-label={`Profile page for ${username}`}
          >
            @{username}
          </Link>
        </MenuItem>
        <MenuItem>
          <Link href="/inbox" aria-label="Inbox page">
            Inbox
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem>
          {username && <LogoutButton aria-label="Logout button" />}
        </MenuItem>
      </Menu>
    </nav>
  );
}
