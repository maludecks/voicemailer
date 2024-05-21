import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "voicemailer-storage",
  access: (allow) => ({
    "audio/*": [allow.authenticated.to(["read", "write"])],
  }),
});
