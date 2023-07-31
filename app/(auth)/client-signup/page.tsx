"use client";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputNo } from "@/components/InputNo";
import supabase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { RegisterClientDetail } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const ClientSignUp = () => {
  const [registerClientDetail, setRegisterClientDetail] =
    useState<RegisterClientDetail>({
      fullName: "",
      password: "",
      email: "",
      phoneNo: "",
    });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confrimEmailMessage, setConfirmEmailMessage] =
    useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { toast } = useToast();
  const [inputValidity, setInputValidity] = useState({
    fullName: false,
    password: false,
    email: false,
    phoneNo: false,
  });

  const handleClientSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(registerClientDetail);
    const { fullName, password, email, phoneNo } = registerClientDetail;

    try {
      // Check if any of the provided input is empty
      if (
        fullName.trim() === "" ||
        password.trim() === "" ||
        phoneNo.trim() === ""
      ) {
        console.log("Please enter all required fields");
        setInputValidity((prevState) => ({
          ...prevState,
          fullName: fullName.trim() === "",
          password: password.trim() === "",
          phoneNo: phoneNo.trim() === "",
        }));
      } else if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          description: "Passsord does not match",
        });
      } else if (password.toLowerCase() === "password") {
        toast({
          variant: "destructive",
          description: "Password cannot be password",
        });
      } else {
        const {
          data: { user },
          error,
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phoneNo,
            },
          },
        });

        if (error) {
          throw error;
        }
        if (user) {
          router.push("/artisans");
          try {
            const { error } = await supabase.from("profiles").upsert({
              id: user.id,
              full_name: fullName,
              phone: phoneNo,
              email: email,
            });

            if (error) {
              throw error;
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

  const handleValueChange = (value: string) => {
    setRegisterClientDetail((prevState) => ({
      ...prevState,
      phoneNo: value,
    }));

    // Reset inputValidity to false when input value changes
    setInputValidity((prevState) => ({
      ...prevState,
      phoneNo: false,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    inputField: string
  ) => {
    const { value } = e.target;
    setRegisterClientDetail((prevState) => ({
      ...prevState,
      [inputField]: value,
    }));

    // Reset inputValidity to false when input value changes
    setInputValidity((prevState) => ({
      ...prevState,
      [inputField]: false,
    }));
  };

  const handleInputBlur = (inputField: string) => {
    const { fullName, password, phoneNo, email } = registerClientDetail;
    if (inputField === "fullName") {
      setInputValidity((prevState) => ({
        ...prevState,
        fullName: fullName.trim() === "",
      }));
    } else if (inputField === "tel") {
      setInputValidity((prevState) => ({
        ...prevState,
        phoneNo: phoneNo.trim() === "",
      }));
    } else if (inputField === "email") {
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
        <div className="space-y-8 md:space-y-0 md:space-x-12 flex-col flex md:flex-row justify-between">
          <div className="bg-[#6272B9] h-[100%] w-full rounded-xl p-8 text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Profile Review
            </h1>
            <ul className="list-disc text-base space-y-4 lg:text-lg">
              <li>
                Ensure the information you provide is accurate and up-to-date.
              </li>
              <li>
                Respect the privacy and rights of other users on the platform.
              </li>
              <li>
                Do not engage in any form of harassment or harmful behavior
                towards others.
              </li>
              <li>
                Be mindful of the terms and conditions set forth by the platform
                and abide by them.
              </li>
              <li>
                Uphold professional conduct and communicate respectfully with
                other users.
              </li>
              <li>
                Keep your account credentials secure and do not share them with
                others.
              </li>
            </ul>
          </div>

          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Signup
            </h1>
            <form action="" onSubmit={handleClientSubmit}>
              <div className="grid w-full my-6 items-center gap-1.5">
                <Label htmlFor="fullName" className="text-base">
                  Full Name
                </Label>
                <Input
                  type="text"
                  name="fullName"
                  className={`w-full text-base h-12 bg-[#ecebf382] ${
                    inputValidity.fullName ? "bg-[#fddddd]" : ""
                  }`}
                  placeholder="Enter your full name"
                  value={registerClientDetail.fullName}
                  onChange={(e) => handleInputChange(e, "fullName")}
                  onBlur={() => handleInputBlur("fullName")}
                />
              </div>
              <div className="grid w-full my-6 items-center gap-1.5">
                <Label htmlFor="email" className="text-base">
                  Email Address
                </Label>
                <Input
                  type="email"
                  name="email"
                  className={`w-full h-12 text-base bg-[#ecebf382] ${
                    inputValidity.email ? "bg-[#fddddd]" : ""
                  }`}
                  placeholder="Enter your email address"
                  value={registerClientDetail.email}
                  onChange={(e) => handleInputChange(e, "email")}
                  onBlur={() => handleInputBlur("email")}
                />
              </div>

              <InputNo
                onValueChange={handleValueChange}
                onHandleBlur={handleInputBlur}
                phoneNoValidity={inputValidity.phoneNo}
              />
              <div className="grid w-full my-6 items-center gap-1.5">
                <Label htmlFor="password" className="ext-base">
                  Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  className={`w-full text-base h-12 bg-[#ecebf382] ${
                    inputValidity.password ? "bg-[#fddddd]" : ""
                  }`}
                  placeholder="Enter your password"
                  value={registerClientDetail.password}
                  onChange={(e) => handleInputChange(e, "password")}
                  onBlur={() => handleInputBlur("password")}
                />
              </div>
              <div className="grid w-full my-6 items-center gap-1.5">
                <Label htmlFor="confirmPassword" className="text-base">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  className={`w-full text-base h-12 bg-[#ecebf382] ${
                    inputValidity.password ? "bg-[#fddddd]" : ""
                  }`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="bg-[#6272B9] text-base text-white w-full text-center"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientSignUp;
