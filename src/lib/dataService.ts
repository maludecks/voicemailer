import { generateClient } from "aws-amplify/data";
import { type Schema } from "@root/amplify/data/resource";
import storageService from "./storageService";

export type MessageWithUrl = {
  id: string;
  senderid: string;
  receiverid: string;
  url: string;
};

class DataService {
  private readonly client = generateClient<Schema>();

  saveMessage = async (
    messageId: string,
    path: string,
    senderId: string,
    receiverId: string
  ) => {
    await this.client.models.Messages.create({
      id: messageId,
      senderid: senderId,
      receiverid: receiverId,
      visibility: "private",
      isread: false,
      path,
    });
  };

  getMessages = async (userId: string): Promise<MessageWithUrl[]> => {
    const { data: messages, errors } = await this.client.models.Messages.list({
      filter: {
        receiverid: {
          eq: userId,
        },
      },
    });

    if (errors && errors.length > 0) {
      console.error("Unable to fetch messages: ", errors);
      throw new Error("Unable to fetch messages");
    }

    if (!messages || messages.length === 0) {
      return [];
    }

    const messagesWithUrl = await Promise.all(
      messages.map(async (message) => {
        const url = await storageService.getAudioUrl(message.path);

        return {
          id: message.id,
          senderid: message.senderid,
          receiverid: message.receiverid,
          url,
        };
      })
    );

    return messagesWithUrl;
  };

  getUserId = async (username: string): Promise<string> => {
    const { data: user } = await this.client.models.Users.get({ username });

    if (!user) {
      throw new Error("User not found");
    }

    return user.userid;
  };
}

export default new DataService();
