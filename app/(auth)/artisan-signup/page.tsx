"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterDetail } from "@/types";
import { FormEvent, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import supabase from "@/lib/supabase";
import { occupations } from "@/components/occupations";
import { InputNo } from "@/components/InputNo";

const ArtisanSignup = () => {
  const [registerArtisanDetail, setRegisterArtisanDetail] =
    useState<RegisterDetail>({
      fullName: "",
      password: "",
      email: "",
      phoneNo: "",
      occupation: "",
    });
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confrimEmailMessage, setConfirmEmailMessage] =
    useState<boolean>(false);
  const [inputValidity, setInputValidity] = useState({
    fullName: false,
    password: false,
    email: false,
    phoneNo: false,
    occupation: false,
  });
  const router = useRouter();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { fullName, password, phoneNo, occupation, email } =
      registerArtisanDetail;
    try {
      // Check if any of the provided input is empty
      if (
        fullName.trim() === "" ||
        password.trim() === "" ||
        phoneNo.trim() === "" ||
        occupation?.trim() === ""
      ) {
        console.log("Please enter all required fields");
        setInputValidity((prevState) => ({
          ...prevState,
          fullName: fullName.trim() === "",
          password: password.trim() === "",
          phoneNo: phoneNo.trim() === "",
          occupation: occupation?.trim() === "",
        }));
      }
      // Check if the password value is the same with the Confirm password value
      else if (password !== confirmPassword) {
        console.log("Passwords must match");
      } else if (password.toLowerCase() === "password") {
        console.log("Password cannot be 'password'");
      }
      // If all fields are filled correctly, call the supabase signup function
      else {
        const {
          data: { user },
          error,
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Adds Extra fields to Supabase Signup function
            data: {
              full_name: fullName,
              phone: phoneNo,
              occupation_name: occupation,
            },
          },
        });

        if (error) {
          throw error;
        }

        if (user) {
          router.push("/artisan-profile");
          console.log("User created successfully");

          try {
            // Updates the user details in the database
            const { error } = await supabase.from("profiles").upsert({
              id: user.id,
              full_name: fullName,
              phone: phoneNo,
              occupation_name: occupation,
              email: email,
            });

            if (error) {
              throw error;
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleValueChange = (value: string) => {
    setRegisterArtisanDetail((prevState) => ({
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
    setRegisterArtisanDetail((prevState) => ({
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
    const { fullName, password, phoneNo, occupation, email } =
      registerArtisanDetail;
    if (inputField === "fullName") {
      setInputValidity((prevState) => ({
        ...prevState,
        fullName: fullName.trim() === "",
      }));
    } else if (inputField === "password") {
      setInputValidity((prevState) => ({
        ...prevState,
        password: password.trim() === "",
      }));
    } else if (inputField === "tel") {
      setInputValidity((prevState) => ({
        ...prevState,
        phoneNo: phoneNo.trim() === "",
      }));
    } else if (inputField === "occupation") {
      setInputValidity((prevState) => ({
        ...prevState,
        occupation: occupation?.trim() === "",
      }));
    } else if (inputField === "email") {
      setInputValidity((prevState) => ({
        ...prevState,
        email: email.trim() === "",
      }));
    }
  };

  return (
    <section className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] mx-auto max-w-[1600px]">
      <div className="bg-white my-4 h-[100%] sm:min-h-[calc(90vh-80px)] rounded-xl p-4 sm:p-8 md:p-12">
        <div className="space-y-8 md:space-y-0 md:space-x-12 flex-col flex md:flex-row items-center justify-between">
          <div className="bg-[#6272B9] h-[100%] w-full rounded-xl p-8 text-white">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Profile review
            </h1>
            <ul className="list-disc space-y-4 text-base lg:text-lg">
              <li>
                Artisan must upload a clear picture of proof of occupation.
              </li>

              <li>Artisan must have priority rights infringement.</li>

              <li>
                You are the owner of your work and you seek permission from
                rightful owners before using his project.
              </li>

              <li>
                Blurry taken images of artisan work will be flagged as
                inappropriate.
              </li>

              <li>
                Fake documents such as changing or editing of work not belonging
                to artisan will be flagged as inappropriate.
              </li>

              <li>
                Artisan must obey all terms and conditions guiding the platform.
              </li>
              <li>
                Artisan should provide links to their social media handle to
                enable client able to reach out to them.
              </li>
            </ul>
          </div>
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Signup
            </h1>
            <form action="" onSubmit={handleRegister}>
              <div className="grid w-full my-6 items-center gap-1.5">
                <Label htmlFor="fullname" className="text-base">
                  Full Name
                </Label>
                <Input
                  type="text"
                  name="fullName"
                  className={`w-full h-12 bg-[#ecebf382] text-base ${
                    inputValidity.fullName ? "bg-[#fddddd]" : ""
                  }`}
                  placeholder="Enter your full name"
                  value={registerArtisanDetail.fullName}
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
                  className={`w-full h-12 bg-[#ecebf382] text-base ${
                    inputValidity.email ? "bg-[#fddddd]" : ""
                  }`}
                  placeholder="Enter your email address"
                  value={registerArtisanDetail.email}
                  onChange={(e) => handleInputChange(e, "email")}
                  onBlur={() => handleInputBlur("email")}
                />
              </div>
              <InputNo
                onValueChange={handleValueChange}
                onHandleBlur={handleInputBlur}
                phoneNoValidity={inputValidity.phoneNo}
              />
              <div className="w-full">
                <Label htmlFor="occupation" className="text-base">
                  Occupation
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={`w-full h-12 justify-between text-base bg-[#ecebf382] ${
                        inputValidity.occupation ? "bg-[#fddddd]" : ""
                      }`}
                    >
                      {value
                        ? occupations.find(
                            (occupation) => occupation.value === value
                          )?.label
                        : "Select Occupation..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-[300px] p-0 max-h-[10rem] overflow-y-scroll">
                    <Command>
                      <CommandInput placeholder="Search occupation..." />
                      <CommandEmpty>No occupation found.</CommandEmpty>
                      <CommandGroup>
                        {occupations.map((occupation) => (
                          <CommandItem
                            key={occupation.value}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue
                              );
                              setRegisterArtisanDetail({
                                ...registerArtisanDetail,
                                occupation: currentValue,
                              });
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={`
                                mr-2 h-4 w-4
                                ${
                                  value === occupation.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                }
                              `}
                            />
                            {occupation.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid w-full my-6 items-center gap-1.5">
                <Label htmlFor="password" className="text-base">
                  Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  className={`w-full h-12 text-base bg-[#ecebf382] ${
                    inputValidity.password ? "bg-[#fddddd]" : ""
                  }`}
                  placeholder="Enter your password"
                  value={registerArtisanDetail.password}
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
                  className={`w-full h-12 text-base bg-[#ecebf382] ${
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

export default ArtisanSignup;
