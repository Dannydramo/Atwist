"use client";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import supabase from "@/lib/supabase";
import { LoginDetail } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const [signInDetail, setSignInDetails] = useState<LoginDetail>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { toast } = useToast();
  const [inputValidity, setInputValidity] = useState({
    email: false,
    password: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = signInDetail;
    try {
      setLoading(true);
      toast({
        description: <>Loag</> && "Logging in...",
      });
      // Supabase Login with Email and password function
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        throw error;
      }
      if (user) {
        setLoading(false);
        // Check if the user is an artisan or client
        user &&
          toast({
            description: "Logged In successfully",
          });
        const occupationName = user?.user_metadata?.occupation_name;
        if (occupationName) {
          // If Artisan, go to the Artisan Profile Page
          router.push("/artisan-profile");
        } else {
          // If Client, go to the see all Artisans Page
          router.push("/artisans");
        }
      }
    } catch (error: any) {
      console.log(error.message);
      setError(true);
      toast({
        variant: "destructive",
        description: error.message,
      });
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setInputValidity((prevState) => ({
      ...prevState,
      [name]: false,
    }));
  };

  const handleInputBlur = (inputField: string) => {
    const { email, password } = signInDetail;
    if (inputField === "email") {
      setInputValidity((prevState) => ({
        ...prevState,
        email: email.trim() === "",
      }));
    } else if (inputField === "password") {
      setInputValidity((prevState) => ({
        ...prevState,
        password: password.trim() === "",
      }));
    }
  };

  return (
    <section className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] mx-auto max-w-[1600px]">
      <div className="bg-white my-4 h-[100%] sm:min-h-[calc(90vh-80px)] rounded-xl p-4 sm:p-8 md:p-12">
        <div className="space-y-8 md:space-y-0 md:space-x-12 flex-col items-center flex md:flex-row justify-between">
          <div className="bg-[#6272B9] flex flex-col items-center justify-center p-4 h-[300px] sm:min-h-[60vh] w-full rounded-xl">
            <h1 className="text-2xl sm:text-4xl leading-7 md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white">
              Welcome
            </h1>
            <h1 className="text-2xl sm:text-4xl leading-7 md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white">
              Back!
            </h1>
          </div>
          <div className="w-full">
            <form action="" onSubmit={handleSubmit}>
              <Input
                type="email"
                name="email"
                className={`w-full my-6 h-12 bg-[#ecebf382] text-sm md:text-base ${
                  inputValidity.email ? "bg-red-500" : ""
                }`}
                placeholder="Enter Your Email"
                value={signInDetail.email}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur("email")}
              />
              <Input
                type="password"
                name="password"
                className={`w-full my-6 h-12 bg-[#ecebf382] text-sm md:text-base ${
                  inputValidity.password ? "bg-red-500" : ""
                }`}
                placeholder="Enter Your Password"
                value={signInDetail.password}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur("password")}
              />

              <Button
                type="submit"
                className="bg-[#6272B9] text-white text-sm md:text-base w-full text-center"
                disabled={inputValidity.email || inputValidity.password}
              >
                {loading ? "Logging in.." : "Login"}
              </Button>
            </form>

            <div className="mt-2 text-sm md:text-base justify-center space-x-1 flex">
              <p>{"Don't"} have an account? </p>
              <Link href="/signup" className="underline text-[#6272B9]">
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
