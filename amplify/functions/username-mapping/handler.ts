import { DynamoDB } from "aws-sdk";
import { Handler } from "aws-lambda";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: Handler = async (event) => {
  const { request } = event;
  const preferredUsername = request.userAttributes.preferred_username;
  const userId = request.userAttributes.sub;

  const params = {
    TableName: process.env.USERS_TABLE_NAME || "Usernames",
    Item: {
      userid: userId,
      username: preferredUsername,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDb.put(params).promise();
    console.log("Successfully mapped username:", params.Item);
    return event;
  } catch (error) {
    console.error("Error mapping username:", error);
    throw new Error("Error inserting into users table");
  }
};
