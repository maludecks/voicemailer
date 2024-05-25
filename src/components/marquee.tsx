"use client";

import React, { useEffect, useState } from "react";
import { Fira_Mono } from "next/font/google";
import { fetchUserAttributes } from "aws-amplify/auth";

const font = Fira_Mono({ weight: "400", subsets: ["latin"] });

const MarqueeText = ({ content }: { content: string }) => {
  return (
    <p className="text-lg before:content-['✨'] before:ml-4 before:mr-4">
      {content}
    </p>
  );
};

const Marquee = () => {
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
    <aside
      className={`${font.className} bg-black h-14 flex items-center text-white w-full overflow-hidden mb-12`}
      aria-label="Dynamic Marquee"
      role="marquee"
    >
      <div
        className="flex w-max animate-marquee whitespace-nowrap"
        aria-live="off"
      >
        <div className="flex space-x-4">
          <MarqueeText content={`Welcome to @${username} voicemail inbox`} />
          <MarqueeText content="Make voicemails fun again" />
          <MarqueeText content="Listen to my greeting" />
          <MarqueeText content="Leave a message after the imaginary beep" />
          <MarqueeText content="Bringing voicemails back to life" />
        </div>
        <div className="flex space-x-4">
          <MarqueeText content={`Welcome to @${username} voicemail inbox`} />
          <MarqueeText content="Make voicemails silly again" />
          <MarqueeText content="Listen to my greeting" />
          <MarqueeText content="Leave a message after the imaginary beep" />
          <MarqueeText content="Bringing voicemails back to life" />
        </div>
      </div>
    </aside>
  );
};

export default Marquee;
