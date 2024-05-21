import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Users: a
    .model({
      username: a.string().required(),
      greetingpath: a.string(),
      timestamp: a.timestamp(),
    })
    .identifier(["username"])
    .authorization((allow) => [allow.publicApiKey()]),
  Messages: a
    .model({
      id: a.string().required(),
      senderid: a.string().required(),
      receiverid: a.string().required(),
      isread: a.boolean().required().default(false),
      visibility: a.string().required().default("private"),
      timestamp: a.timestamp(),
    })
    .identifier(["id"])
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
