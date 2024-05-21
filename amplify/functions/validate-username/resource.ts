import { defineFunction } from "@aws-amplify/backend";

export const validateUsername = defineFunction({
  name: "validate-username-function",
  timeoutSeconds: 10,
});
