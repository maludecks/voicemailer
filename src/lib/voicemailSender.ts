import { nanoid } from "nanoid";
import storageService from "./storageService";
import dataService from "./dataService";

class VoicemailSender {
  send = async (audio: Blob, senderId: string, receiverId: string) => {
    const messageId = nanoid(16);
    let path;

    try {
      path = await storageService.uploadAudio(audio, messageId, receiverId);
    } catch (error) {
      console.error("Error uploading audio:", error);
      throw error;
    }

    try {
      await dataService.saveMessage(messageId, path, senderId, receiverId);
    } catch (error) {
      console.error("Error saving message:", error);
      throw error;
    }
  };
}

export default new VoicemailSender();
