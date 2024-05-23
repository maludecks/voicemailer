"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AudioRecorder from "@root/src/components/audio/audio-recorder";
import { dataService } from "@root/src/lib/dataService";
import { Alert, Loader } from "@aws-amplify/ui-react";

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
      // setError((error as Error).message);
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
        <AudioRecorder receiver={{ id: userId, username }} />
      ) : (
        <p>This user does not exist :(</p>
      )}
    </>
  );
}
