import React from "react";
import { Card, CardContent } from "./ui/card";
interface ConfirmEmailProps {
  emailName: string;
}
const ConfirmEmail = ({ emailName }: ConfirmEmailProps) => {
  return (
    <>
      <Card className="w-full">
        <CardContent>
          <h1> Email Confirmation Required</h1>
          <p>Your account has been created successfully.</p>
          <p>
            We sent the email to {emailName}. Check your inbox to activate the
            account. If the confirmation email is not in your inbox, please
            check the Spam. Thank you.
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default ConfirmEmail;
