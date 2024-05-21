import { Handler } from "aws-lambda";
import * as AWS from "aws-sdk";

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

export const handler: Handler = async (event, context, callback) => {
  const { userPoolId, request } = event;
  const preferredUsername = request.userAttributes.preferred_username;

  try {
    const listUsersParams = {
      UserPoolId: userPoolId,
      Filter: `preferred_username = "${preferredUsername}"`,
    };

    const response = await cognitoIdentityServiceProvider
      .listUsers(listUsersParams)
      .promise();

    if (response.Users && response.Users.length > 0) {
      console.log("Username conflict", response.Users);
      const error = new Error("Username already exists");
      callback(error, event);
    }

    console.log("No username conflict", response.Users);
    callback(null, event);
  } catch (error) {
    callback(new Error("Unable to validate username"), event);
  }
};
