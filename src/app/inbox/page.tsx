"use client";

import { Alert, Tabs, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { dataService, MessageWithUrl } from "@root/src/lib/dataService";
import MessageInbox from "@root/src/components/message-inbox";
import AudioRecorder from "@root/src/components/audio/audio-recorder";
import Account from "@root/src/components/auth/account";
import { FaMicrophoneAlt, FaUserCog } from "react-icons/fa";

export default function Inbox() {
  const [newMessages, setNewMessages] = useState<MessageWithUrl[]>([]);
  const [oldMessages, setOldMessages] = useState<MessageWithUrl[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updateMessages, setUpdateMessages] = useState(false);

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
      setUpdateMessages(false);
    } catch (e) {
      setError("Unable to fetch messages");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [updateMessages]);

  return (
    <section
      className="flex flex-col w-full items-center min-h-screen"
      aria-label="User inbox"
    >
      <div
        className="text-2xl text-center font-bold text-blue-700 p-4"
        role="heading"
        aria-level={1}
      >
        Inbox
      </div>
      <div className="inbox-tabs">
        <Tabs
          defaultValue="1"
          aria-label="Inbox tabs"
          items={[
            {
              label: "New messages",
              value: "1",
              content: (
                <MessageInbox
                  messages={newMessages}
                  shouldMarkAsRead={true}
                  shouldShowDelete={true}
                  shouldUpdate={setUpdateMessages}
                />
              ),
            },
            {
              label: "Opened messages",
              value: "2",
              content: (
                <MessageInbox
                  messages={oldMessages}
                  shouldShowDelete={true}
                  shouldUpdate={setUpdateMessages}
                />
              ),
            },
            {
              label: (
                <span
                  className="flex flex-row w-full justify-center items-center"
                  aria-label="Greeting settings"
                >
                  <FaMicrophoneAlt className="mr-2" aria-hidden="true" />{" "}
                  Greeting
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
                <span
                  className="flex flex-row w-full justify-center items-center"
                  aria-label="Account settings"
                >
                  <FaUserCog className="mr-2" aria-hidden="true" /> Account
                  settings
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
        <Alert
          isDismissible={true}
          variation="error"
          className="m-4"
          role="alert"
        >
          {error}
        </Alert>
      )}
    </section>
  );
}
