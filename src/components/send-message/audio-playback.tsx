import { Button } from "@aws-amplify/ui-react";
import { TbSend } from "react-icons/tb";

type AudioPlaybackProps = {
  audioURL: string;
  sendAudio: () => void;
};
export default function AudioPlayback({
  audioURL,
  sendAudio,
}: AudioPlaybackProps) {
  return (
    <div className="mt-4">
      <audio src={audioURL} controls />
      <Button color={"primary"} onClick={sendAudio}>
        Send <TbSend className="ml-2" />
      </Button>
    </div>
  );
}
