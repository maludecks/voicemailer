"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { nanoid } from "nanoid";
import { useState, useRef } from "react";
import Alerts from "./alerts";
import AudioPlayback from "./audio-playback";
import RecordingControls from "./recording-controls";
import voicemailSender from "@root/src/lib/voicemailSender";

export default function AudioRecorder({ receiverId }: { receiverId: string }) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { user } = useAuthenticator();

  const sendAudio = async () => {
    setShowSuccess(false);

    if (!user || !user.userId) {
      setError("You must be logged in to send a message");
      return;
    }

    if (!audioBlob) {
      setError("No audio to send");
      return;
    }

    try {
      await voicemailSender.send(audioBlob, user.userId, receiverId);
      setShowSuccess(true);
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
    <>
      <RecordingControls
        isRecording={isRecording}
        startRecording={startRecording}
        stopRecording={stopRecording}
      />
      {audioURL && <AudioPlayback audioURL={audioURL} sendAudio={sendAudio} />}
      <Alerts error={error} showSuccess={showSuccess} />
    </>
  );
}
