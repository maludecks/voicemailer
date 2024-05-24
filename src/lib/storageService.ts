import { Amplify } from "aws-amplify";
import outputs from "@root/amplify_outputs.json";
import { uploadData, getUrl } from "aws-amplify/storage";

Amplify.configure(outputs);

class StorageService {
  uploadAudio = async (
    audioBlob: Blob,
    messageId: string,
    userId: string,
    type: "voicemail" | "greeting"
  ): Promise<string> => {
    const audioPath =
      type === "voicemail"
        ? `audio/${userId}/${messageId}.mp3`
        : `greeting/${userId}/${messageId}.mp3`;

    const res = uploadData({
      path: audioPath,
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

  getAudioUrl = async (path: string) => {
    const link = await getUrl({
      path,
      options: {
        validateObjectExistence: false,
      },
    });

    return link.url.toString();
  };
}

export const storageService = new StorageService();
