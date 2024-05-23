"use client";

import { Alert, Card, Tabs, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { dataService, MessageWithUrl } from "@root/src/lib/dataService";
import Message from "@root/src/components/message";

export default function Inbox() {
  const [messages, setMessages] = useState<MessageWithUrl[]>([]);
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

      setMessages(messages);
    } catch (e) {
      setError("Unable to fetch messages");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <>
      <Tabs
        defaultValue="1"
        items={[
          {
            label: "New messages",
            value: "1",
            content: <Message messages={newMessages} />,
          },
          {
            label: "Previous",
            value: "2",
            content: <Message messages={oldMessages} />,
          },
        ]}
        isLazy
      />

      {error && <Alert isDismissible={true}>{error}</Alert>}
    </>
  );
}
