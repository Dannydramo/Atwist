"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import supabase from "@/lib/supabase";
import { Artisan } from "@/types";

interface ArtisansProps {
  allArtisans: Artisan[];
  setAllArtisans: Dispatch<SetStateAction<Artisan[]>>;
}

const ArtisanComponent: React.FC<ArtisansProps> = ({
  allArtisans,
  setAllArtisans,
}) => {
  const [errorCount, setErrorCount] = useState(0);

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
        setErrorCount((prevCount) => prevCount + 1);
      }

      return undefined;
    },
    []
  );
  useEffect(() => {
    // Call downloadImage for each artisan's avatar_url
    const fetchArtisanImages = async () => {
      const updatedArtisans = await Promise.all(
        allArtisans.map(async (artisan) => {
          try {
            const url = await downloadImage(artisan.avatar_url);
            // Update the artisan object with the downloaded image URL
            return { ...artisan, profile_image: url };
          } catch (error: any) {
            console.log("Error downloading image: ", error.message);
            // Handle the error here (e.g., set a default image URL)
            return { ...artisan, profile_image: undefined };
          }
        })
      );

      setAllArtisans(updatedArtisans);
    };

    if (allArtisans.length > 0 && errorCount < 3) {
      fetchArtisanImages();
    }
  }, [allArtisans, downloadImage, errorCount, setAllArtisans]);
  // Custom image loader function for Next.js Image component
  const imageLoader = ({ src }: { src: string }) => {
    return src;
  };
  return (
    <>
      {allArtisans.map((artisan) => (
        <Link href={`/artisan/${artisan.id}`} key={artisan.id} className="">
          <div className="bg-white rounded-xl p-4 my-4">
            <div className="flex items-center space-x-4">
              {artisan.profile_image ? (
                <div className="rounded-[90%] w-[50px] h-[50px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] overflow-hidden">
                  <Image
                    src={artisan.profile_image}
                    alt="Profile"
                    width={200}
                    height={200}
                    priority
                    loader={imageLoader}
                  />
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
                </div>
              )}
              <div className="space-y-1">
                <p className="text-base sm:text-lg md:text-xl font-semibold">
                  {artisan.full_name}
                </p>
                <p className="text-sm md:text-base">
                  {artisan.occupation_name}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default ArtisanComponent;
