import { defineAuth } from "@aws-amplify/backend";
import { validateUsername } from "../functions/validate-username/resource";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    preferredUsername: {
      mutable: false,
      required: true,
    },
  },
  triggers: {
    preSignUp: validateUsername,
  },
});
