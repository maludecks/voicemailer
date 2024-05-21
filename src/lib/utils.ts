import { NextApiRequest } from "next";

export function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

export function getUserId(req: NextApiRequest): string {
  const accessToken = req.headers.authorization?.split(" ")[1] ?? "";

  if (!accessToken) {
    console.error(
      "No access token found in request",
      req.headers.authorization
    );
    throw new Error("No access token found in request");
  }

  const userId = parseJwt(accessToken)["cognito:username"] ?? "";

  if (!userId) {
    console.error("No user found in access token", accessToken);
    throw new Error("No user found in access token");
  }

  return userId;
}
