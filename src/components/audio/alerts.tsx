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
        <Alert
          isDismissible={true}
          hasIcon={true}
          heading="Oh no..."
          role="alert"
          aria-live="assertive"
        >
          {error}
        </Alert>
      )}
      {showSuccess && (
        <Alert
          isDismissible={true}
          hasIcon={true}
          heading="Voilà!"
          role="alert"
          aria-live="polite"
        >
          Voicemail sent 🎉
        </Alert>
      )}
    </>
  );
}
