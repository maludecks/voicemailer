import { Card } from "@aws-amplify/ui-react";
import { MessageWithUrl, dataService } from "../lib/dataService";

type MessageProps = {
  messages: MessageWithUrl[];
};

export default function MessageInbox({ messages }: MessageProps) {
  const handleAudioEnd = async (messageId: string) => {
    try {
      await dataService.markMessageAsRead(messageId);
    } catch (error) {
      console.error("Error marking message as read", error);
    }
  };

  return (
    <>
      {messages.map((message) => (
        <Card key={message.id} title="Inbox">
          from: {message.sender.username}
          <audio controls onEnded={() => handleAudioEnd(message.id)}>
            <source src={message.url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </Card>
      ))}
    </>
  );
}
