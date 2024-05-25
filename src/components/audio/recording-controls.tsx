import { Button } from "@aws-amplify/ui-react";
import { FaMicrophoneAlt } from "react-icons/fa";
import { FaCircleStop } from "react-icons/fa6";

type RecordingControlsProps = {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
};

export default function RecordingControls({
  isRecording,
  startRecording,
  stopRecording,
}: RecordingControlsProps) {
  return (
    <>
      {isRecording ? (
        <Button
          className="white-button"
          onClick={stopRecording}
          aria-pressed="true"
        >
          <span className="flex items-center" aria-hidden="true">
            <FaCircleStop className="mr-2" aria-hidden="true" /> Stop recording
          </span>
        </Button>
      ) : (
        <Button
          className="pink-button"
          onClick={startRecording}
          aria-pressed="false"
        >
          <span className="flex items-center" aria-hidden="true">
            <FaMicrophoneAlt className="mr-2" aria-hidden="true" /> Start
            recording
          </span>
        </Button>
      )}
    </>
  );
}
