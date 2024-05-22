"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { uploadData } from "aws-amplify/storage";
import { nanoid } from "nanoid";
import { useState, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@root/amplify/data/resource";
import { User } from "../../app/[username]/page";
import Alerts from "./alerts";
import AudioPlayback from "./audio-playback";
import RecordingControls from "./recording-controls";

export default function AudioRecorder({ receiver }: { receiver: User }) {
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
      console.error("No audio to send");
      setError("No audio to send");
      return;
    }

    const messageId = nanoid(16);

    try {
      const path = await uploadAudio(messageId);
      saveMessage(messageId, path);

      setShowSuccess(true);
    } catch (error) {
      console.error("Error sending voicemail:", error);
      setError("Error sending voicemail :(");
    }
  };

  const saveMessage = async (messageId: string, path: string) => {
    const client = generateClient<Schema>();

    await client.models.Messages.create({
      id: messageId,
      senderid: user.userId,
      receiverid: receiver.userid,
      visibility: "private",
      isread: false,
      path,
    });
  };

  const uploadAudio = async (messageId: string): Promise<string> => {
    if (!audioBlob) {
      throw new Error("No audio to upload");
    }

    const res = uploadData({
      path: `audio/${user.userId}/${messageId}.mp3`,
      data: audioBlob,
      options: {
        contentType: audioBlob.type,
      },
    });

    const path = (await res.result).path;

    if (!path) {
      throw new Error("No path to file found");
    }

    return path;
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
      console.error("Error accessing microphone:", err);
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
