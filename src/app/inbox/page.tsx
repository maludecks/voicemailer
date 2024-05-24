"use client";

import { Alert, Card, Tabs, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { dataService, MessageWithUrl } from "@root/src/lib/dataService";
import MessageInbox from "@root/src/components/message-inbox";
import AudioRecorder from "@root/src/components/audio/audio-recorder";
import Account from "@root/src/components/auth/account";
import { HiOutlineMailOpen } from "react-icons/hi";
import { FaMicrophoneAlt, FaUserCog } from "react-icons/fa";
import { FcSettings } from "react-icons/fc";

export default function Inbox() {
  const [newMessages, setNewMessages] = useState<MessageWithUrl[]>([]);
  const [oldMessages, setOldMessages] = useState<MessageWithUrl[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthenticator();

  const fetchMessages = async () => {
    try {
      const messages = await dataService.getMessages(user.userId);

      const newMessages = [];
      const oldMessages = [];

      for (const message of messages) {
        if (!message.isRead) {
          newMessages.push(message);
        } else {
          oldMessages.push(message);
        }
      }

      setNewMessages(newMessages);
      setOldMessages(oldMessages);
    } catch (e) {
      setError("Unable to fetch messages");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <>
      <div className="text-2xl align-center font-bold text-blue-700 p-4">
        Inbox
      </div>
      <div className="flex flex-col w-full justify-center items-center inbox-tabs">
        <Tabs
          defaultValue="1"
          items={[
            {
              label: "New messages",
              value: "1",
              content: (
                <MessageInbox messages={newMessages} shouldMarkAsRead={true} />
              ),
            },
            {
              label: "Opened messages",
              value: "2",
              content: (
                <MessageInbox messages={oldMessages} shouldMarkAsRead={false} />
              ),
            },
            {
              label: (
                <span className="flex flex-row w-full justify-center items-center">
                  <FaMicrophoneAlt className="mr-2" /> Greeting
                </span>
              ),
              value: "3",
              content: (
                <div className="flex justify-center p-4">
                  <AudioRecorder type="greeting" />
                </div>
              ),
            },
            {
              label: (
                <span className="flex flex-row w-full justify-center items-center">
                  <FaUserCog className="mr-2" /> Account settings
                </span>
              ),
              value: "4",
              content: <Account />,
            },
          ]}
          isLazy
        />
      </div>
      {error && (
        <Alert isDismissible={true} variation="error" className="m-4">
          {error}
        </Alert>
      )}
    </>
  );
}
