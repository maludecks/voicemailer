import { MessageWithUrl, dataService } from "../lib/dataService";
import Link from "next/link";

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
        <div
          key={message.id}
          className="w-full flex flex-col items-center justify-center border-gray-900 border-b-2 mb-2"
        >
          <p>
            <span className="text-sm italic">from: </span>
            <Link
              className="underline underline-offset-2 decoration-dotted"
              href={`/${message.sender.username}`}
            >
              @{message.sender.username}
            </Link>
          </p>
          <section className="mt-2 mb-2">
            <audio controls onEnded={() => handleAudioEnd(message.id)}>
              <source src={message.url} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </section>
        </div>
      ))}
    </>
  );
}
