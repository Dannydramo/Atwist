import React from "react";
import { Card, CardContent } from "./ui/card";
interface ConfirmEmailProps {
  emailName: string;
}
const ConfirmEmail = ({ emailName }: ConfirmEmailProps) => {
  return (
    <>
      <Card className="w-full bg-[#ecebf382] mt-4">
        <CardContent>
          <h1 className="my-2 text-2xl"> Email Confirmation Required</h1>
          <p className="my-2">Your account has been created successfully.</p>
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
