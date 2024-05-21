"use client";

import { Alert, Button, useAuthenticator } from "@aws-amplify/ui-react";
import { uploadData } from "aws-amplify/storage";
import { nanoid } from "nanoid";
import { useState, useRef } from "react";
import { FaMicrophoneAlt } from "react-icons/fa";
import { FaCircleStop } from "react-icons/fa6";
import { TbSend } from "react-icons/tb";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/../amplify/data/resource";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { user } = useAuthenticator();

  const sendAudio = async () => {
    const messageId = nanoid(16);
    uploadAudio(messageId);
    saveMessage(messageId);
  };

  const saveMessage = async (messageId: string) => {
    if (!user.userId) {
      throw new Error("No user ID found");
    }

    const client = generateClient<Schema>();

    await client.models.Messages.create({
      id: messageId,
      senderid: user.userId,
      receiverid: "testuserid",
      visibility: "private",
      timestamp: Date.now(),
      isread: false,
    });
  };

  const uploadAudio = (messageId: string) => {
    setShowSuccess(false);

    try {
      if (!audioBlob) {
        console.error("No audio to send");
        setError("No audio to send");
        return;
      }

      uploadData({
        path: `audio/${user.userId}/${messageId}.mp3`,
        data: audioBlob,
        options: {
          contentType: audioBlob.type,
        },
      });

      setShowSuccess(true);
    } catch (error) {
      console.error("Error sending voicemail:", error);
      setError("Error sending voicemail :(");
      throw error;
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
      {audioURL && (
        <div className="mt-4">
          <audio src={audioURL} controls />
          <Button color={"primary"} onClick={() => sendAudio()}>
            Send <TbSend className="ml-2" />
          </Button>
        </div>
      )}

      {error && (
        <Alert isDismissible={true} hasIcon={true} heading="Oh no...">
          {error}
        </Alert>
      )}

      {showSuccess && (
        <Alert isDismissible={true} hasIcon={true} heading="Voilà!">
          Voicemail sent 🎉
        </Alert>
      )}
    </>
  );
};

export default AudioRecorder;
