"use client";

import { Card, useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/../amplify/data/resource";
import { useEffect, useState } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";

const client = generateClient<Schema>();

type Message = Schema["Messages"]["type"];

export default function Inbox() {
  const [messages, setMessages] = useState<Message[]>([]);

  const { user } = useAuthenticator();

  const fetchMessages = async () => {
    const userAttributes = await fetchUserAttributes();
    console.log("User attributes: ", userAttributes);

    const { data: messages, errors } = await client.models.Messages.list({
      filter: {
        receiverid: {
          eq: user.userId,
        },
      },
    });

    if (errors && errors.length > 0) {
      console.error("Unable to fetch messages: ", errors);
      return;
    }

    if (!messages || messages.length === 0) {
      return;
    }

    setMessages(messages);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <>
      {messages.map((message) => (
        <Card key={message.id} title="Inbox">
          message
        </Card>
      ))}
    </>
  );
}
