import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Usernames: a
    .model({
      userid: a.string().required(),
      username: a.string().required(),
    })
    .identifier(["username"])
    .secondaryIndexes((index) => [index("userid")])
    .authorization((allow) => [allow.publicApiKey()]),
  Greetings: a
    .model({
      userid: a.string().required(),
      path: a.string().required(),
    })
    .identifier(["userid"])
    .authorization((allow) => [allow.publicApiKey()]),
  Messages: a
    .model({
      id: a.string().required(),
      senderid: a.string().required(),
      senderusername: a.string().required(),
      receiverid: a.string().required(),
      receiverusername: a.string().required(),
      path: a.string().required(),
      isread: a.boolean().required().default(false),
      visibility: a.string().required().default("private"),
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
