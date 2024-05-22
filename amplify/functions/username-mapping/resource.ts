import { defineFunction } from "@aws-amplify/backend";

export const usernameMapping = defineFunction({
  name: "username-mapping-function",
  timeoutSeconds: 10,
});
