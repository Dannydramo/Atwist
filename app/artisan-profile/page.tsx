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
import Link from "next/link";

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

  const handleNavigate = () => {
    router.push(`/edit-profile?id=${user?.id}`);
  };

  return (
    <section className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] mx-auto max-w-[1600px]">
      <div className="bg-white my-4 h-[100%] sm:min-h-[calc(90vh-80px)] rounded-xl p-4 sm:p-8 md:p-12">
        {user ? (
          <div>
            <div className="flex items-center space-x-4">
              <ProfileUpload userId={user?.id} />
              <div>
                <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                  {user?.user_metadata?.full_name}
                </p>
                <p className="mb-2 text-sm sm:text-base md:text-lg ">
                  {userDetails?.loaction}
                </p>
              </div>
            </div>
            <div className="flex my-4 justify-between">
              <div className="text-sm flex flex-col space-y-2 md:text-base">
                {/* <p>{user?.email}</p> */}
                <p>{user?.user_metadata?.occupation_name}</p>
                {/* <p>{user?.user_metadata?.phone}</p> */}
                <a href={`mailto:${user?.email}`}>{user?.email}</a>
                <a href={`tel:${user?.user_metadata?.phone}`}>
                  {user?.user_metadata?.phone}
                </a>
              </div>
              <div className="">
                <Button
                  onClick={handleNavigate}
                  className="border text-sm sm:text-base border-[#6272B9] bg-transparent my-2 text-black outline-none hover:bg-[#6272B9] hover:text-white duration-500 ease-in rounded-[20px] text-center"
                >
                  Edit Profile
                </Button>
                <Link
                  href="/active-contract"
                  className="border text-sm sm:text-base border-[#6272B9] bg-transparent my-2 text-black outline-none hover:bg-[#6272B9] hover:text-white duration-500 ease-in rounded-[20px] text-center"
                >
                  Active Contract
                </Link>
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
            <div className="flex items-center mb-4 space-x-4">
              <Skeleton
                circle={true}
                containerClassName="w-[50px] h-[50px] sm:w-[70px] h-[70px] md:w-[100px] md:h-[100px]"
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