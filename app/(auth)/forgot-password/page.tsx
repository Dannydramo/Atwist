"use client";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import supabase from "@/lib/supabase";
import Link from "next/link";

const ForgotPassword = () => {
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const getURL = () => {
    let url = process?.env?.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000/";

    const updatePasswordPath = "update-password";

    if (url === "http://localhost:3000/") {
      url = `${url}${updatePasswordPath}`;
    } else {
      url = url.endsWith("/") ? url : `${url}/`;
      url = `${url}${updatePasswordPath}`;
    }

    url = url.includes("http") ? url : `https://${url}`;

    return url;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        forgotEmail,
        {
          redirectTo: getURL(),
        }
      );
      if (error) {
        throw error;
      }
      if (data) {
        console.log(data);
        setLoading(false);
        toast({
          description: "Password Reset Link has been sent to your email",
        });
      }
    } catch (error: any) {
      console.log(error.message);
      toast({
        variant: "destructive",
        description: error.message,
      });
      setLoading(false);
    }
  };

  return (
    <section className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[65%] mx-auto max-w-[1300px]">
      <div className="bg-white my-4 h-[100%] sm:h-auto rounded-xl p-4 sm:p-8 md:p-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl my-4">
          Forgot Password{" "}
        </h1>
        <p className=" text-base lg:text-lg mt-4">
          Forgot your password to your atwist account? Resetting your password
          is just one step.
        </p>
        <div className="w-full">
          <form action="" onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              onChange={(e) => {
                setForgotEmail(e.target.value);
              }}
              className="w-full my-6 h-12 bg-[#ecebf382] text-base"
              placeholder="Enter Your Email"
              value={forgotEmail}
            />

            <Button
              type="submit"
              className="bg-[#6272B9] text-white text-base w-full text-center"
            >
              {loading ? "Sending Reset Link" : "Send Reset Link"}
            </Button>
          </form>
          <div className="flex text-base space-x-1 justify-center mt-4">
            <p>Already have an account?</p>
            <Link href="/login" className="text-[#6272B9] underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
