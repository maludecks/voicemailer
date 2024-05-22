import { nanoid } from "nanoid";
import { storageService } from "./storageService";
import { dataService, User } from "./dataService";

class VoicemailSender {
  send = async (audio: Blob, sender: User, receiver: User) => {
    const messageId = nanoid(16);
    let path;

    try {
      path = await storageService.uploadAudio(audio, messageId, receiver.id);
    } catch (error) {
      console.error("Error uploading audio:", error);
      throw error;
    }

    try {
      await dataService.saveMessage(messageId, path, sender, receiver);
    } catch (error) {
      console.error("Error saving message:", error);
      throw error;
    }
  };
}

export const voicemailSender = new VoicemailSender();
