import { Button } from "@aws-amplify/ui-react";
import { TbSend } from "react-icons/tb";

type AudioPlaybackProps = {
  audioURL: string;
  saveAudio?: () => void;
};
export default function AudioPlayback({
  audioURL,
  saveAudio,
}: AudioPlaybackProps) {
  return (
    <div className="mt-4">
      <audio src={audioURL} controls />

      {saveAudio && (
        <Button className="yellow-button" onClick={saveAudio}>
          Send <TbSend className="ml-2" />
        </Button>
      )}
    </div>
  );
}
