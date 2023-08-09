"use client";

import supabase from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

interface ImageDetails {
  avatarUrl: string;
  bookingImage?: boolean;
}

const FetchArtisanImage = ({ avatarUrl, bookingImage }: ImageDetails) => {
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
  );

  const downloadImage = useCallback(
    async (path: string): Promise<string | undefined> => {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);
        if (error) {
          throw error;
        }

        if (data) {
          return new Promise<string | undefined>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = () => {
              reject(new Error("Error reading image file."));
            };
            reader.readAsDataURL(data);
          });
        }
      } catch (error: any) {
        console.log("Error downloading image: ", error.message);
      }

      return undefined;
    },
    []
  );

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = await downloadImage(avatarUrl);
        setProfileImage(url); // Update the profileImage state using setProfileImage
      } catch (error) {}
    };

    fetchImage();
  }, [avatarUrl, downloadImage]);

  // Custom image loader function for Next.js Image component
  const imageLoader = ({ src }: { src: string }) => {
    return src;
  };

  return (
    <>
      <div className="">
        {profileImage ? (
          <div
            className={`rounded-[90%]  overflow-hidden ${
              bookingImage
                ? "w-[40px] h-[40px]"
                : "w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px]"
            }`}
          >
            <Image
              src={profileImage}
              alt="Profile"
              width={200}
              height={200}
              priority
              loader={imageLoader}
            />
          </div>
        ) : (
          <div
            className={`${
              bookingImage
                ? "w-[40px] h-[40px]"
                : "w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] "
            }`}
          >
            <Image
              src="/noprofile.jpg"
              alt="Profile"
              width={100}
              height={100}
              priority
            />
          </div>
        )}
      </div>
    </>
  );
};

export default FetchArtisanImage;
