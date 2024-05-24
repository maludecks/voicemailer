"use client";

import React from "react";
import { AccountSettings, Button } from "@aws-amplify/ui-react";

type DeleteButtonProps = React.ComponentProps<
  typeof AccountSettings.DeleteUser.DeleteButton
>;

type SubmitButtomProps = React.ComponentProps<
  typeof AccountSettings.ChangePassword.SubmitButton
>;

export default function Account() {
  const handleSuccess = () => {
    alert("account successfully changed!");
  };

  return (
    <div className="flex flex-col justify-center w-full gap-3">
      <AccountSettings.ChangePassword
        onSuccess={handleSuccess}
        components={{
          SubmitButton: (props: SubmitButtomProps) => (
            <Button className="white-button" {...props}>
              Change password
            </Button>
          ),
        }}
      />
      <AccountSettings.DeleteUser
        components={{
          DeleteButton: (props: DeleteButtonProps) => (
            <Button className="pink-button" {...props}>
              Delete account
            </Button>
          ),
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
