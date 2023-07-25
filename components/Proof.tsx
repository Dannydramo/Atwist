"use client";
import { v4 as uuidv4 } from "uuid";
import supabase from "@/lib/supabase";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AiOutlineCamera } from "react-icons/ai";
interface UserId {
  userId?: string;
  artisanFullName?: string;
  isClient?: boolean;
}
const Proof = ({ userId, artisanFullName, isClient }: UserId) => {
  const [images, setImages] = useState<any>([]);

  const imageUrl =
    "https://wpohczmajoaxjjxyttgk.supabase.co/storage/v1/object/public/proof_of_occupation_images/";
  const deleteImage = async (imageName: string) => {
    const { error } = await supabase.storage
      .from("proof_of_occupation_images")
      .remove([userId + "/" + imageName]);
    if (error) {
      console.log(error.message);
    } else {
      console.log("image deleted");
      getImages();
    }
  };

  const getImages = useCallback(async () => {
    const { data, error } = await supabase.storage
      .from("proof_of_occupation_images")
      .list(userId + "/", {
        limit: 10,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data !== null) {
      setImages(data);
    } else {
      console.log("Error", error.message);
    }
  }, [userId]);

  useEffect(() => {
    getImages();
  }, [getImages]);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }
      const file = e.target.files[0];
      const { data, error } = await supabase.storage
        .from("proof_of_occupation_images")
        .upload(userId + "/" + uuidv4(), file);
      if (data) {
        console.log("upload successsful");

        getImages();
      } else {
        console.log(error.message);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="my-4">
        <div className="flex space-x-8">
          {isClient ? (
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
              {artisanFullName} Proof Of Occupation
            </h1>
          ) : (
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
              Proof Of Occupation
            </h1>
          )}
          {!isClient && (
            <div className="h-[40px] w-[40px] overflow-hidden">
              <div className="relative">
                <AiOutlineCamera className="w-full h-full" />
                <Input
                  type="file"
                  className="w-full h-full absolute cursor-pointer bottom-0 right-0 z-12 opacity-0"
                  accept="image/jpg, image/png"
                  multiple
                  onChange={(e) => uploadImage(e)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 lg:grid-cols-3">
        {images.map((image: { name: string }) => (
          <div className="" key={imageUrl + userId + "/" + image.name}>
            <Image
              src={imageUrl + userId + "/" + image.name}
              alt={image.name}
              width={300}
              height={300}
            />
            {!isClient && (
              <Button type="button" onClick={() => deleteImage(image.name)}>
                Delete Image
              </Button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Proof;
