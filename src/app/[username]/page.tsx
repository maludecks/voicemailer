"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AudioRecorder from "@root/src/components/audio/audio-recorder";
import { dataService } from "@root/src/lib/dataService";
import { Alert, Divider, Loader } from "@aws-amplify/ui-react";
import AudioPlayback from "@root/src/components/audio/audio-playback";
import Marquee from "@root/src/components/marquee";

export default function Profile() {
  const [userId, setUserId] = useState<string>();
  const [greetingUrl, setGreetingUrl] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { username } = useParams<{ username: string }>();

  const fetchUser = async () => {
    try {
      const userId = await dataService.getUserId(username);
      const greeting = await dataService.getGreeting(userId);
      setUserId(userId);
      setGreetingUrl(greeting);
    } catch (error) {
      // setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {error && <Alert isDismissible={true}>{error}</Alert>}

      {loading && <Loader />}

      {userId && greetingUrl && (
        <div className="flex w-full flex-col gap-4 items-center justify-center">
          <Marquee />
          <h1 className="text-3xl mb-2">@{username}</h1>
          <h3 className="mb-2">inbox</h3>
          <AudioPlayback audioURL={greetingUrl} />
          <AudioRecorder type="voicemail" receiver={{ id: userId, username }} />
        </div>
      )}

      {!loading && !userId && <p>This user does not exist :(</p>}
    </>
  );
}
