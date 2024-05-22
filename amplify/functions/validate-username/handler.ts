import { Handler } from "aws-lambda";
import * as AWS from "aws-sdk";

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

export const handler: Handler = async (event) => {
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
      throw new Error("Username already exists");
    }

    console.log("No username conflict", response.Users);
    return event; // Return the original event object to continue the Cognito workflow
  } catch (error) {
    console.error("Error during username validation:", error);
    throw error; // Throw error to indicate a problem with the pre-signup process
  }
};
