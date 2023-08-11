"use client";
import { Input } from "@/components/ui/input";
import supabase from "@/lib/supabase";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { useToast } from "./ui/use-toast";

interface UserId {
  userId?: string;
  edit?: boolean;
}

const ProfileUpload = ({ userId, edit }: UserId) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Downloads the profile image from the Supabase storage and sets it as the profileImage state
  const downloadImage = useCallback(
    async (path: string) => {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);
        if (error) {
          throw error;
        }

        if (data) {
          const url = URL.createObjectURL(data);
          try {
            const { error } = await supabase.from("profiles").upsert({
              id: userId,
              profile_image: url,
            });

            if (error) {
              throw error;
            } else {
              let { data } = await supabase
                .from("profiles")
                .select(`profile_image`)
                .eq("id", userId)
                .single();
              if (data) {
                setProfileImage(data?.profile_image);
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error: any) {
        console.log("Error downloading image: ", error.message);
      }
    },
    [userId]
  );

  // Fetches the user's profile image from Supabase
  const getProfile = useCallback(async () => {
    try {
      let { data, error } = await supabase
        .from("profiles")
        .select(`avatar_url`)
        .eq("id", userId)
        .single();
      if (error) {
        throw error;
      }
      if (data) {
        downloadImage(data?.avatar_url);
      }
    } catch (error) {
      console.log(error);
    }
  }, [downloadImage, userId]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  // Handles the upload of the profile image
  const uploadProfileImage: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}-${Math.random()}.${fileExt}`;
      setLoading(true);
      toast({
        description: "Uploading Image",
      });
      //  Update the profile image in the supabase storage bucket
      if (edit) {
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .update(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          });
        if (uploadError) {
          throw uploadError;
        } else {
          setLoading(false);
          toast({
            description: "Image Updated Succesful",
          });
          // Upserts the profile record in the Supabase "profiles" table with the new avatar URL
          const { error } = await supabase.from("profiles").upsert({
            id: userId,
            avatar_url: filePath,
          });

          if (!error) {
            // Refreshes the profile image
            getProfile();
            downloadImage(filePath);
          }
        }
      }
      // Uploads a image file to the Supabase storage
      else {
        let { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        } else {
          setLoading(false);
          toast({
            description: "Image Upload Succesful",
          });
          // Upserts the profile record in the Supabase "profiles" table with the new avatar URL
          const { error } = await supabase.from("profiles").upsert({
            id: userId,
            avatar_url: filePath,
          });

          if (!error) {
            // Refreshes the profile image
            getProfile();
            downloadImage(filePath);
          }
        }
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
    }
  };

  // Custom image loader function for Next.js Image component
  const imageLoader = ({ src }: { src: string }) => {
    return src;
  };

  return (
    <>
      <div className="">
        {profileImage ? (
          <div className="relative w-[70px] sm:w-[80px] md:w-[100px]">
            <div className="rounded-[90%] w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] overflow-hidden">
              <Image
                src={profileImage}
                alt="Profile"
                width={200}
                height={200}
                priority
                loader={imageLoader}
              />
            </div>

            {edit && (
              <div className="absolute bottom-0 right-0 h-[40px] w-[40px] overflow-hidden">
                <div className="relative">
                  <AiOutlineCamera className="w-[40px] h-[40px]" />
                  <Input
                    type="file"
                    className="w-full h-full absolute cursor-pointer bottom-0 right-0 z-12 opacity-0"
                    accept="image/jpg, image/png"
                    onChange={uploadProfileImage}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px]">
            <Image
              src="/noprofile.jpg"
              alt="Profile"
              width={100}
              height={100}
              priority
            />
            <div className="absolute bottom-0 right-[-10px] md:right-0 h-[30px] md:h-[40px] w-[30px] md:w-[40px]">
              <div className="relative">
                <AiOutlineCamera className="w-full h-full" />
                <Input
                  type="file"
                  className="w-full h-full absolute cursor-pointer bottom-0 right-0 z-12 opacity-0"
                  accept="image/jpg, image/png"
                  onChange={uploadProfileImage}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default ProfileUpload;
