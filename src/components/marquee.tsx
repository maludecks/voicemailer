"use client";

import React from "react";
import { Fira_Mono } from "next/font/google";

const font = Fira_Mono({ weight: "400", subsets: ["latin"] });

const MarqueeText = ({ content }: { content: string }) => {
  return (
    <p className="text-lg before:content-['✨'] before:ml-4 before:mr-4">
      {content}
    </p>
  );
};

const Marquee = () => {
  return (
    <aside
      className={`${font.className} bg-black h-14 flex items-center text-white w-full overflow-hidden`}
    >
      <div className="flex w-max animate-marquee whitespace-nowrap">
        <div className="flex space-x-4">
          <MarqueeText content="Welcome to @testuser11111 voicemail inbox" />
          <MarqueeText content="Listen to my greeting" />
          <MarqueeText content="Leave a message after the imaginary beep" />
          <MarqueeText content="Bringing voicemails back to life" />
        </div>
        <div className="flex space-x-4">
          <MarqueeText content="Welcome to @testuser11111 voicemail inbox" />
          <MarqueeText content="Listen to my greeting" />
          <MarqueeText content="Leave a message after the imaginary beep" />
          <MarqueeText content="Bringing voicemails back to life" />
        </div>
      </div>
    </aside>
  );
};

export default Marquee;
