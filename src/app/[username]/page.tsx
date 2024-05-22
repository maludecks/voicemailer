"use client";

import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { useParams } from "next/navigation";
import { type Schema } from "@root/amplify/data/resource";
import AudioRecorder from "@root/src/components/send-message/audio-recorder";

const client = generateClient<Schema>();
export type User = Schema["Users"]["type"];

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams<{ username: string }>();

  const checkUser = async () => {
    try {
      const { data: user } = await client.models.Users.get({ username });
      setUser(user);
    } catch (error) {
      console.error("Unable to fetch user:", error);
    } finally {
      setLoading(false); // Ensure loading is set to false after fetching
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Render a loading indicator while data is being fetched
  }

  return user ? (
    <AudioRecorder receiver={user} />
  ) : (
    <p>This user doesn't exist :(</p>
  );
}
