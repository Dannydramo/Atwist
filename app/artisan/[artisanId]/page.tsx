"use client";
import supabase from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { userDetails } from "@/types";
import Skeleton from "react-loading-skeleton";
import ArtisanDetails from "@/components/ArtisanDetails";
import { User } from "@supabase/supabase-js";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

const Artisan = ({ params }: { params: { artisanId: string } }) => {
  const id: string = params.artisanId;
  const router = useRouter();
  const [artisan, setArtisan] = useState<userDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState();
  const [userDetails, setUserDetails] = useState<userDetails>();
  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        if (user) {
          setUser(user);
          const { data, error } = await supabase
            .from("profiles")
            .select()
            .eq("id", user?.id);

          if (data) {
            setUserDetails(data[0]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    async function getArtisan() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select()
          .eq("id", id);
        if (error) {
          throw error;
        }
        if (data) {
          setIsLoading(false);
          setArtisan(data);
          console.log(data[0].id);
        }
      } catch (error: any) {
        console.log(error.message);
        setError(true);
        setIsLoading(false);
        setErrorMessage(error.message);
      }
    }
    getArtisan();
    getUser();
  }, [id]);
  return (
    <>
      <section className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] mx-auto max-w-[1600px]">
        <div className="bg-white relative my-4 h-[100%] sm:min-h-[calc(90vh-80px)] rounded-xl p-4 sm:p-8 md:p-12">
          <div className="absolute top-4 left-4">
            <div
              onClick={() => {
                router.replace("/artisan-profile");
              }}
              className="flex space-x-2 cursor-pointer items-center mb-4"
            >
              <IoMdArrowBack />
              <p>Back</p>
            </div>
          </div>
          {error && <>{errorMessage}</>}
          {isLoading && !error ? (
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
                  containerClassName="flex-1 w-full sm:w-[80%] md:w-[70%] h-[10px] sm:h-[15px] md:w-[20px]"
                  width="inherit"
                  height="inherit"
                />
              </div>

              <Skeleton
                containerClassName="flex-1 w-full sm:w-[80%] md:w-[70%] h-[25px] sm:h-[35px] md:w-[40px]"
                width="inherit"
                height="inherit"
              />
            </div>
          ) : (
            artisan?.map((artisanDetail) => (
              <ArtisanDetails
                key={artisanDetail.id}
                artisanDetails={artisanDetail}
                user={user}
                userDetails={userDetails}
              />
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default Artisan;
