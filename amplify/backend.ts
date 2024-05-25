import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { storage } from "./storage/resource";
import { validateUsername } from "./functions/validate-username/resource";
import { data } from "./data/resource";
import { usernameMapping } from "./functions/username-mapping/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  storage,
  data,
  validateUsername,
  usernameMapping,
});
