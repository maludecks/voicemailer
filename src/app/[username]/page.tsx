"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AudioRecorder from "@root/src/components/audio/audio-recorder";
import { MessageWithUrl, dataService } from "@root/src/lib/dataService";
import { Alert, Loader } from "@aws-amplify/ui-react";
import AudioPlayback from "@root/src/components/audio/audio-playback";
import Marquee from "@root/src/components/marquee";
import { BsInbox } from "react-icons/bs";
import MessageInbox from "@root/src/components/message-inbox";
import { FaVoicemail } from "react-icons/fa";

export default function Profile() {
  const [userId, setUserId] = useState<string>();
  const [greetingUrl, setGreetingUrl] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { username } = useParams<{ username: string }>();
  const [messages, setMessages] = useState<MessageWithUrl[]>([]);
  const [updateMessages, setUpdateMessages] = useState(false);

  const fetchProfile = async () => {
    try {
      const userId = await dataService.getUserId(username);
      const greeting = await dataService.getGreeting(userId);

      setUserId(userId);

      if (greeting) {
        setGreetingUrl(greeting);
      }

      await fetchMessages(userId);
    } catch (error) {
      // setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    const messages = await dataService.getMessages(userId);
    setMessages(messages);
  };

  useEffect(() => {
    fetchProfile();
  }, [updateMessages]);

  return (
    <main className="flex flex-col flex-1 overflow-auto h-screen">
      {error && <Alert isDismissible={true}>{error}</Alert>}

      {loading && <Loader />}

      {userId && (
        <>
          <Marquee />
          <div className="flex w-full flex-col gap-4 items-center justify-center flex-grow max-h-64">
            <h1 className="text-5xl font-bold">@{username}</h1>

            {greetingUrl && <AudioPlayback audioURL={greetingUrl} />}
          </div>
          <section className="flex flex-col md:flex-row w-full mt-12 flex-grow border-t-2 border-black">
            <div className="flex w-full flex-col h-[500px] border-b-2 md:border-b-0 md:h-auto md:w-1/2 border-r-0 md:border-r-2 border-black items-center justify-center">
              <h3 className="flex items-center gap-2 justify-center text-3xl font-bold mb-4">
                Leave a voicemail <FaVoicemail className="ml-2" />
              </h3>
              <AudioRecorder
                type="voicemail"
                receiver={{ id: userId, username }}
                shouldUpdate={setUpdateMessages}
              />
            </div>
            <div className="flex flex-col w-full h-[500px] md:h-auto md:w-1/2">
              <h2 className="flex items-center justify-center text-3xl font-bold border-black border-b-2">
                Public inbox <BsInbox className="ml-2" />
              </h2>
              <div>
                <MessageInbox
                  messages={messages}
                  shouldMarkAsRead={false}
                  shouldUpdate={setUpdateMessages}
                />
              </div>
            </div>
          </section>
        </>
      )}

      {!loading && !userId && (
        <div className="flex w-full flex-grow flex-col items-center justify-center">
          <p>This user does not exist :(</p>
        </div>
      )}
    </main>
  );
}
