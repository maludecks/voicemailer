"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useRef } from "react";
import Alerts from "./alerts";
import AudioPlayback from "./audio-playback";
import RecordingControls from "./recording-controls";
import { voicemailService } from "@root/src/lib/voicemailService";
import { fetchUserAttributes } from "aws-amplify/auth";
import { User } from "@root/src/lib/dataService";

type AudioRecorderProps = {
  type: "voicemail" | "greeting";
  receiver?: User;
  shouldUpdate?: (update: boolean) => void;
};

export default function AudioRecorder({
  type,
  receiver,
  shouldUpdate,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { user } = useAuthenticator();

  const saveGreeting = async () => {
    setShowSuccess(false);

    if (!user || !user.userId) {
      setError("You must be logged in to save a greeting");
      return;
    }

    if (!audioBlob) {
      setError("No audio to save");
      return;
    }

    try {
      await voicemailService.saveGreeting(audioBlob, {
        id: user.userId,
        username: user.username,
      });
      setShowSuccess(true);
    } catch (error) {
      setError("Error saving greeting :(");
    }
  };

  const sendAudio = async () => {
    setShowSuccess(false);

    if (!user || !user.userId) {
      setError("You must be logged in to send a message");
      return;
    }

    if (!receiver) {
      setError("No receiver selected");
      return;
    }

    if (!audioBlob) {
      setError("No audio to send");
      return;
    }

    const userAttr = fetchUserAttributes();
    const senderUsername = (await userAttr).preferred_username;

    if (!senderUsername) {
      setError("Unable to get sender username");
      return;
    }

    try {
      await voicemailService.sendVoicemail(
        audioBlob,
        { id: user.userId, username: senderUsername },
        { id: receiver.id, username: receiver.username }
      );
      setShowSuccess(true);
      setAudioURL("");

      if (shouldUpdate) {
        shouldUpdate(true);
      }
    } catch (error) {
      setError("Error sending voicemail :(");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        setAudioBlob(audioBlob);
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      setError("Error accessing microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <RecordingControls
        isRecording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
      />
      {audioURL && (
        <AudioPlayback
          audioURL={audioURL}
          saveAudio={type === "voicemail" ? sendAudio : saveGreeting}
        />
      )}
      <Alerts error={error} showSuccess={showSuccess} />
    </div>
  );
}
