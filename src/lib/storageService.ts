import { Amplify } from "aws-amplify";
import outputs from "@root/amplify_outputs.json";
import { uploadData, getUrl } from "aws-amplify/storage";

Amplify.configure(outputs);

class StorageService {
  uploadAudio = async (
    audioBlob: Blob,
    messageId: string,
    userId: string
  ): Promise<string> => {
    const res = uploadData({
      path: `audio/${userId}/${messageId}.mp3`,
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
        expiresIn: 20,
      },
    });

    return link.url.toString();
  };
}

export const storageService = new StorageService();
