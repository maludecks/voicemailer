import { Amplify } from "aws-amplify";
import config from "../../../amplify_outputs.json";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../data/resource";
import { Handler } from "aws-lambda";

Amplify.configure(config);

export const handler: Handler = async (event) => {
  const client = generateClient<Schema>();

  const { request } = event;
  const preferredUsername = request.userAttributes.preferred_username;
  const userId = request.userAttributes.sub;

  try {
    const { data, errors } = await client.models.Users.create({
      userid: userId,
      username: preferredUsername,
    });

    if (errors) {
      console.error("Error mapping username:", errors);
      throw new Error("Error inserting into users table");
    }

    console.log("Successfully mapped username:", data);
    return event;
  } catch (error) {
    console.error("Exception when mapping username:", error);
    throw error;
  }
};
