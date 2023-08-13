"use client";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import supabase from "@/lib/supabase";
import { LoginDetail } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

const UpdatePassword = () => {
  const [updateDetail, setUpdateDetails] = useState<LoginDetail>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [inputValidity, setInputValidity] = useState({
    email: false,
    password: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = updateDetail;
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });
      if (error) {
        throw error;
      }
      if (data) {
        setLoading(false);
        toast({
          description: "Password Updated Successfully",
        });
        router.replace("/login");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setInputValidity((prevState) => ({
      ...prevState,
      [name]: false,
    }));
  };

  return (
    <section className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[65%] mx-auto max-w-[1300px]">
      <div className="bg-white my-4 h-[100%] sm:h-auto rounded-xl p-4 sm:p-8 md:p-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl my-4">
          Update Password
        </h1>

        <div className="w-full">
          <form action="" onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              className={`w-full my-6 h-12 bg-[#ecebf382] text-base ${
                inputValidity.email ? "bg-[#fddddd]" : ""
              }`}
              placeholder="Enter Your Email"
              value={updateDetail.email}
              onChange={handleInputChange}
            />
            <Input
              type="password"
              name="password"
              className={`w-full my-6 h-12 bg-[#ecebf382] text-base ${
                inputValidity.password ? "bg-[#fddddd]" : ""
              }`}
              placeholder="Enter Your Password"
              value={updateDetail.password}
              onChange={handleInputChange}
            />

            <Button
              type="submit"
              className="bg-[#6272B9] text-white text-base w-full text-center"
              disabled={inputValidity.email || inputValidity.password}
            >
              {loading ? "Updating Password:" : "Update Password"}
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

export default UpdatePassword;
