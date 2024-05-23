import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "voicemailer-storage",
  access: (allow) => ({
    "audio/*": [allow.authenticated.to(["read", "write"])],
    // TODO: find a way to make proper access work
    "greeting/*": [
      allow.entity("identity").to(["read", "write"]),
      allow.guest.to(["read"]),
    ],
  }),
});
