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
    <Button onClick={isRecording ? stopRecording : startRecording}>
      {isRecording ? (
        <span className="flex items-center">
          <FaCircleStop className="mr-2" /> Stop recording
        </span>
      ) : (
        <span className="flex items-center">
          <FaMicrophoneAlt className="mr-2" /> Start recording
        </span>
      )}
    </Button>
  );
}
