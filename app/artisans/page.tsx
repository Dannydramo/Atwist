"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
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
import Skeleton from "react-loading-skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { ChevronsUpDown, Check } from "lucide-react";
import ArtisanComponent from "@/components/ArtisanComponent";
import ClientDetails from "@/components/ClientDetails";
import { userDetails } from "@/types";
const Artisans = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [allArtisans, setAllArtisans] = useState<userDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<userDetails>();
  const skeletonValue = [1, 2, 3, 4, 5];
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

        setUser(user);
        console.log(user?.id);

        if (!user) {
          router.replace("/login");
          console.log("No user found");
        } else {
          const fetchClientDetails = async () => {
            const { data, error } = await supabase
              .from("profiles")
              .select()
              .eq("id", user?.id);

            if (data) {
              setUserDetails(data[0]);
            } else {
              console.log(error.message);
            }
          };
          const fetchArtisans = async () => {
            try {
              const { data, error } = await supabase
                .from("profiles")
                .select()
                .neq("occupation_name", null);

              if (error) {
                throw error;
              }

              if (data) {
                setAllArtisans(data);
                setIsLoading(false);
              }
            } catch (error: any) {
              console.log(error.message);
              setError(true);
              setIsLoading(false);
              setErrorMessage(error.message);
            }
          };

          fetchArtisans();
          fetchClientDetails();
        }
      } catch (error: any) {
        console.log(error.message);
        setError(true);
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    }

    getUser();
  }, [router]);

  if (!user) {
    return null;
  }

  const handleArtisanSearch = async (selectedValue: string) => {
    // Update the selectedValue state with the chosen occupation
    setValue(selectedValue);
    setOpen(false);
    setSelectedValue(selectedValue);
    setError(
      allArtisans.every((artisan) => artisan.occupation_name !== selectedValue)
    );
  };

  // Apply filtering logic to get the displayed artisans
  const displayedArtisans = selectedValue
    ? allArtisans.filter((artisan) => artisan.occupation_name === selectedValue)
    : allArtisans;

  return (
    <>
      <section className="w-[95%] sm:w-[90%] mx-auto max-w-[1600px]">
        <div className="flex flex-col md:flex-row md:justify-between space-y-3 md:space-y-0 md:space-x-6">
          <div className="">
            <ClientDetails
              userId={user?.id}
              userName={user?.user_metadata?.full_name}
              userPhone={user?.user_metadata?.phone}
            />
          </div>
          <div className="w-full mt-3">
            {error && <>{errorMessage}</>}
            <div className="max-w-[300px]">
              <Label htmlFor="occupation" className="text-sm md:text-base">
                Filter Artisan
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-12 justify-between bg-[#ecebf382]"
                  >
                    {value
                      ? occupations.find(
                          (occupation) => occupation.value === value
                        )?.label
                      : "Select Artisan"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 max-h-[10rem] overflow-y-scroll">
                  <Command>
                    <CommandInput placeholder="Search for Artisan..." />
                    <CommandEmpty>No Artisan found.</CommandEmpty>
                    <CommandGroup>
                      {occupations.map((occupation) => (
                        <CommandItem
                          key={occupation.value}
                          onSelect={() => handleArtisanSearch(occupation.value)}
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

            {isLoading && !error ? (
              skeletonValue.map((skelValue) => (
                <div
                  className="flex items-center mb-4 space-x-4"
                  key={skelValue}
                >
                  <Skeleton
                    circle={true}
                    containerClassName="w-[50px] h-[40px] sm:w-[70px] h-[70px] md:w-[100px] md:h-[100px]"
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
              ))
            ) : displayedArtisans.length === 0 ? (
              <div>No artisan found for the selected occupation.</div>
            ) : (
              <ArtisanComponent
                allArtisans={displayedArtisans}
                setAllArtisans={setAllArtisans}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Artisans;
