import { ErrorMessageProps } from "../types";

function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return <div className="error">{message}</div>;
}

export default ErrorMessage;
