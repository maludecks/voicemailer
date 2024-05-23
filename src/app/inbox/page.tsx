"use client";

import { Alert, Card, Tabs, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { dataService, MessageWithUrl } from "@root/src/lib/dataService";
import MessageInbox from "@root/src/components/message-inbox";
import AudioRecorder from "@root/src/components/audio/audio-recorder";

export default function Inbox() {
  const [newMessages, setNewMessages] = useState<MessageWithUrl[]>([]);
  const [oldMessages, setOldMessages] = useState<MessageWithUrl[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthenticator();

  const fetchMessages = async () => {
    try {
      const messages = await dataService.getMessages(user.userId);

      for (const message of messages) {
        if (message.isRead === false) {
          setNewMessages([...newMessages, message]);
        } else {
          setOldMessages([...oldMessages, message]);
        }
      }
    } catch (e) {
      setError("Unable to fetch messages");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <>
      <div className="text-2xl font-bold text-blue-700 p-4">Inbox</div>
      <div className="flex justify-center p-4">
        <AudioRecorder type="greeting" />
      </div>
      <Tabs
        defaultValue="1"
        items={[
          {
            label: "New messages",
            value: "1",
            content: <MessageInbox messages={newMessages} />,
          },
          {
            label: "Previous",
            value: "2",
            content: <MessageInbox messages={oldMessages} />,
          },
        ]}
        isLazy
      />

      {error && (
        <Alert isDismissible={true} variation="error" className="m-4">
          {error}
        </Alert>
      )}
    </>
  );
}
