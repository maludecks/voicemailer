import { HiOutlineMailOpen } from "react-icons/hi";
import { MessageWithUrl, dataService } from "../lib/dataService";
import Link from "next/link";
import { Button } from "@aws-amplify/ui-react";
import { BiTrash } from "react-icons/bi";

type MessageProps = {
  messages: MessageWithUrl[];
  shouldUpdate?: (update: boolean) => void;
  shouldMarkAsRead?: boolean;
  shouldShowDelete?: boolean;
};

export default function MessageInbox({
  messages,
  shouldMarkAsRead,
  shouldShowDelete,
  shouldUpdate,
}: MessageProps) {
  const handleAudioEnd = async (messageId: string) => {
    try {
      await dataService.markMessageAsRead(messageId);

      if (shouldUpdate) {
        shouldUpdate(true);
      }
    } catch (error) {
      console.error("Error marking message as read", error);
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await dataService.deleteMessage(messageId);

      if (shouldUpdate) {
        shouldUpdate(true);
      }
    } catch (error) {
      console.error("Error marking message as read", error);
    }
  };

  return (
    <>
      {messages.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <HiOutlineMailOpen />
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className="w-full flex flex-col items-center justify-center border-gray-900 border-b-2 mb-2"
          >
            <p>
              <span className="text-xs italic">from: </span>
              <Link
                className="underline text-sm underline-offset-2 decoration-dotted"
                href={`/${message.sender.username}`}
              >
                @{message.sender.username}
              </Link>
              <span className="text-xs">
                {" // "}
                {message.createdAt.toUTCString()}
              </span>
            </p>
            <section className="flex flex-row items-center mb-2">
              <audio
                style={{ marginRight: "10px" }}
                controls
                onEnded={() => shouldMarkAsRead && handleAudioEnd(message.id)}
              >
                <source src={message.url} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
              {shouldShowDelete && (
                <Button
                  className="pink-button"
                  onClick={() => handleDelete(message.id)}
                >
                  <BiTrash />
                </Button>
              )}
            </section>
          </div>
        ))
      )}
    </>
  );
}
