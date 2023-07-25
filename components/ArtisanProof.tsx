"use client";

import supabase from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

interface ArtisanId {
  artisanId: string;
  artisanFullName: string;
}

const ArtisanProof = ({ artisanId, artisanFullName }: ArtisanId) => {
  const imageUrl =
    "https://wpohczmajoaxjjxyttgk.supabase.co/storage/v1/object/public/proof_of_occupation_images/";
  const [images, setImages] = useState<any>([]);

  const getImages = useCallback(async () => {
    try {
      const { data, error } = await supabase.storage
        .from("proof_of_occupation_images")
        .list(artisanId + "/", {
          limit: 10,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });
      if (error) {
        throw error;
      }
      if (Array.isArray(data) && data.length > 0) {
        setImages(data);
        console.log(data);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }, [artisanId]);

  useEffect(() => {
    getImages();
  }, [getImages]);

  return (
    <>
      <div className="my-4">
        <div className="flex space-x-8">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
            {artisanFullName} Proof Of Occupation
          </h1>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 lg:grid-cols-3">
        {images.map((image: { name: string }) => (
          <div className="" key={imageUrl + artisanId + "/" + image.name}>
            <Image
              src={imageUrl + artisanId + "/" + image.name}
              alt={image.name}
              width={300}
              height={300}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default ArtisanProof;
