import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@root/amplify/data/resource";
import { storageService } from "./storageService";
import outputs from "@root/amplify_outputs.json";

Amplify.configure(outputs);

export type User = {
  id: string;
  username: string;
};

export type MessageWithUrl = {
  id: string;
  sender: User;
  receiver: User;
  isRead: boolean;
  url: string;
};

class DataService {
  private readonly client = generateClient<Schema>();

  saveMessage = async (
    messageId: string,
    path: string,
    sender: User,
    receiver: User
  ) => {
    await this.client.models.Messages.create({
      id: messageId,
      senderid: sender.id,
      senderusername: sender.username,
      receiverid: receiver.id,
      receiverusername: receiver.username,
      visibility: "private",
      isread: false,
      path,
    });
  };

  markMessageAsRead = async (messageId: string) => {
    await this.client.models.Messages.update({
      id: messageId,
      isread: true,
    });
  };

  saveGreeting = async (user: User, path: string) => {
    const prevGreeting = await this.getGreeting(user.id);

    const newGreeting = {
      userid: user.id,
      path,
    };

    if (!prevGreeting) {
      await this.client.models.Greetings.create(newGreeting);
    } else {
      await this.client.models.Greetings.update(newGreeting);
    }
  };

  getGreeting = async (userId: string): Promise<string | null> => {
    const { data: greeting } = await this.client.models.Greetings.get({
      userid: userId,
    });

    if (!greeting) {
      return null;
    }

    const url = await storageService.getAudioUrl(greeting.path);

    return url;
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
      messages.map(async (message): Promise<MessageWithUrl> => {
        const url = await storageService.getAudioUrl(message.path);

        return {
          id: message.id,
          sender: {
            id: message.senderid,
            username: message.senderusername,
          },
          receiver: {
            id: message.receiverid,
            username: message.receiverusername,
          },
          url,
          isRead: message.isread,
        };
      })
    );

    return messagesWithUrl;
  };

  deleteMessage = async (messageId: string) => {
    const { errors } = await this.client.models.Messages.delete({
      id: messageId,
    });

    if (errors && errors.length > 0) {
      console.error("Unable to delete message: ", errors);
      throw new Error("Unable to delete message");
    }
  };

  getUserId = async (username: string): Promise<string> => {
    const { data: user, errors } = await this.client.models.Usernames.get({
      username,
    });

    if (errors && errors.length > 0) {
      console.error("Unable to fetch user: ", errors);
      throw new Error("Unable to fetch user");
    }

    if (!user) {
      throw new Error("User not found");
    }

    return user.userid;
  };
}

export const dataService = new DataService();
