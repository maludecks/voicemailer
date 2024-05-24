"use client";

import React, { useEffect, useState } from "react";
import LogoutButton from "@src/components/auth/logout-button";
import { fetchUserAttributes } from "aws-amplify/auth";
import { Menu, MenuButton, MenuItem, View } from "@aws-amplify/ui-react";
import { RxAvatar } from "react-icons/rx";
import { motion } from "framer-motion";
import { FaVoicemail } from "react-icons/fa";

export default function Header() {
  const [username, setUsername] = useState<string>();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

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
    <nav className="flex items-center pl-16 pr-16 h-24 bg-[#feea80]">
      <FaVoicemail size={35} className="mr-auto" />
      <Menu
        trigger={
          <MenuButton className="menu-button" size="large">
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
            >
              <RxAvatar className="avatar-icon" size={25} />
            </motion.span>
          </MenuButton>
        }
        className="main-menu"
      >
        <MenuItem isDisabled>@{username}</MenuItem>
        <MenuItem>{username && <LogoutButton />}</MenuItem>
      </Menu>
    </nav>
  );
}
