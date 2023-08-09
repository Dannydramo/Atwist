"use client";
import ProfileUpload from "@/components/ProfileUpload";
import Proof from "@/components/Proof";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { userDetails } from "@/types";
import { CiLocationOn } from "react-icons/ci";
import {
  BiLogoFacebook,
  BiLogoInstagramAlt,
  BiLogoLinkedin,
  BiLogoTwitter,
} from "react-icons/bi";

const ArtisanProfile = () => {
  const [user, setUser] = useState<User | null>();
  const [userDetails, setUserDetails] = useState<userDetails>();
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      setUser(user);

      if (!user) {
        router.push("/login");
      } else {
        const { data, error } = await supabase
          .from("profiles")
          .select()
          .eq("id", user?.id);

        if (data) {
          setUserDetails(data[0]);
        } else {
          console.log(error.message);
        }
      }
    }

    getUser();
  }, [router]);

  return (
    <section className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] mx-auto max-w-[1600px]">
      <div className="bg-white my-4 h-[100%] sm:min-h-[calc(90vh-80px)] rounded-xl p-4 sm:p-8 md:p-12">
        {user ? (
          <div>
            <div className="flex items-center space-x-4">
              <ProfileUpload userId={user?.id} />
              <div className="">
                <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 md:mb-2">
                  {user?.user_metadata?.full_name}
                </p>
                <p className="mb-2 text-base md:text-lg ">
                  <CiLocationOn /> {userDetails?.location}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row my-4 sm:justify-between">
              <div className="flex flex-col space-y-1 text-base">
                <p>{user?.user_metadata?.occupation_name}</p>
                <p>{user?.email}</p>
                <p>{user?.user_metadata?.phone}</p>
              </div>
              <div className="flex space-x-3">
                <a
                  href={`${userDetails?.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BiLogoFacebook />
                </a>
                <a
                  href={`${userDetails?.linkedIn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BiLogoLinkedin />
                </a>
                <a
                  href={`${userDetails?.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BiLogoTwitter />
                </a>
                <a
                  href={`${userDetails?.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BiLogoInstagramAlt />
                </a>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-3 my-2 space-y-3 sm:space-y-0">
                <Button
                  onClick={() => {
                    router.push(`/edit-profile?id=${user?.id}`);
                  }}
                  className="border text-base border-[#6272B9] bg-transparent text-black outline-none hover:bg-[#6272B9] hover:text-white duration-500 ease-in rounded-[20px] text-center"
                >
                  Edit Profile
                </Button>
                <Button
                  onClick={() => {
                    router.push(`/active-contract?id=${user?.id}`);
                  }}
                  className="border text-base border-[#6272B9] bg-transparent text-black outline-none hover:bg-[#6272B9] hover:text-white duration-500 ease-in rounded-[20px] text-center"
                >
                  Active Contract
                </Button>
              </div>
            </div>
            <div className="my-4">
              <h1 className="font-semibold mb-2 text-lg sm:text-xl md:text-2xl">
                Description
              </h1>
              <p className="ml-2 text-sm sm:text-base">
                {userDetails?.description || "No description"}
              </p>
            </div>

            <Proof userId={user?.id} />
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-4 space-x-1 md:space-x-4">
              <Skeleton
                circle={true}
                containerClassName="w-[50px] h-[40px] sm:w-[70px] h-[60px] md:w-[100px] md:h-[100px]"
                height="inherit"
                width="inherit"
              />

              <Skeleton
                count={2}
                containerClassName="flex-1 w-full sm:w-[80%] md:w-[70%] h-[10px] sm:h-[15px] md:h-[20px]"
                width="inherit"
                height="inherit"
              />
            </div>
            <Skeleton
              height="inherit"
              width="inherit"
              count={3}
              containerClassName="w-full sm:w-[80%] md:w-[50%] h-[10px] sm:h-[15px] md:h-[20px]"
            />
            <Skeleton
              containerClassName="flex-1 w-full sm:w-[80%] md:w-[70%] h-[40px] sm:h-[55px] md:h-[70px] lg:h-[100px]"
              width="inherit"
              height="inherit"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ArtisanProfile;
