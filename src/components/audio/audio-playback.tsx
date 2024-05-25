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
      {audioURL && <audio src={audioURL} controls />}

      {audioURL && saveAudio && (
        <Button className="yellow-button" onClick={saveAudio}>
          Send <TbSend className="ml-2" />
        </Button>
      )}
    </>
  );
}
