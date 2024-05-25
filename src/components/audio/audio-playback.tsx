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
    <>
      {audioURL && (
        <audio controls aria-label="Audio playback" preload="auto">
          <source src={audioURL} />
        </audio>
      )}

      {audioURL && saveAudio && (
        <Button
          className="yellow-button"
          onClick={saveAudio}
          aria-label="Send audio"
          tabIndex={0}
        >
          Send <TbSend className="ml-2" aria-hidden="true" />
        </Button>
      )}
    </>
  );
}
