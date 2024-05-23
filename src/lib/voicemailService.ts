import { nanoid } from "nanoid";
import { storageService } from "./storageService";
import { dataService, User } from "./dataService";

class VoicemailService {
  sendVoicemail = async (audio: Blob, sender: User, receiver: User) => {
    const messageId = nanoid(16);
    let path;

    try {
      path = await storageService.uploadAudio(
        audio,
        messageId,
        receiver.id,
        "voicemail"
      );
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

  saveGreeting = async (audio: Blob, user: User) => {
    const greetingId = nanoid(16);
    let path;

    try {
      path = await storageService.uploadAudio(
        audio,
        greetingId,
        user.id,
        "greeting"
      );
    } catch (error) {
      console.error("Error uploading audio:", error);
      throw error;
    }

    try {
      await dataService.saveGreeting(user, path);
    } catch (error) {
      console.error("Error saving greeting:", error);
      throw error;
    }
  };
}

export const voicemailService = new VoicemailService();
