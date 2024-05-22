"use client";

import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { useParams } from "next/navigation";
import { type Schema } from "@root/amplify/data/resource";
import AudioRecorder from "@root/src/components/send-message/audio-recorder";
import dataService from "@root/src/lib/dataService";
import { Alert, Loader } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();
export type User = Schema["Users"]["type"];

export default function Profile() {
  const [userId, setUserId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { username } = useParams<{ username: string }>();

  const checkUser = async () => {
    try {
      const userId = await dataService.getUserId(username);
      setUserId(userId);
    } catch (error) {
      setError("Can't find this user :(");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <>
      {error && <Alert isDismissible={true}>{error}</Alert>}

      {loading ? (
        <Loader />
      ) : userId ? (
        <AudioRecorder receiverId={userId} />
      ) : (
        <p>This user doesn't exist :(</p>
      )}
    </>
  );
}
