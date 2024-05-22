import { Alert } from "@aws-amplify/ui-react";

export default function Alerts({
  error,
  showSuccess,
}: {
  error: string | null;
  showSuccess: boolean;
}) {
  return (
    <>
      {error && (
        <Alert isDismissible={true} hasIcon={true} heading="Oh no...">
          {error}
        </Alert>
      )}
      {showSuccess && (
        <Alert isDismissible={true} hasIcon={true} heading="Voilà!">
          Voicemail sent 🎉
        </Alert>
      )}
    </>
  );
}
