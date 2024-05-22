"use client";

import { Alert, Card, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { dataService, MessageWithUrl } from "@root/src/lib/dataService";

export default function Inbox() {
  const [messages, setMessages] = useState<MessageWithUrl[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthenticator();

  const fetchMessages = async () => {
    try {
      const messages = await dataService.getMessages(user.userId);
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
      {messages.map((message) => (
        <Card key={message.id} title="Inbox">
          from: {message.sender.username}
          <audio controls>
            <source src={message.url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </Card>
      ))}

      {error && <Alert isDismissible={true}>{error}</Alert>}
    </>
  );
}
