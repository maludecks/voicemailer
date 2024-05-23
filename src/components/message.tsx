import { Card } from "@aws-amplify/ui-react";
import { MessageWithUrl } from "../lib/dataService";

type MessageProps = {
  messages: MessageWithUrl[];
};

export default function Message({ messages }: MessageProps) {
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
    </>
  );
}
