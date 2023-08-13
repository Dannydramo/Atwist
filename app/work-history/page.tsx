"use client";

import supabase from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookingDetails } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";
import FetchArtisanImage from "@/components/FetchArtisanImage";
import { IoMdArrowBack } from "react-icons/io";

const WorkHistory = () => {
  const searchParams = useSearchParams();
  const artisanId = searchParams.get("id") ?? "";
  const router = useRouter();
  const [workHistory, setWorkHistory] = useState<BookingDetails[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getActiveContracts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("completed_contract")
        .eq("id", artisanId);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setWorkHistory(data[0].completed_contract);
      }
    } catch (error: any) {
      console.error("Error fetching active contracts:", error.message);
      setError("Error fetching Work history. Please try again later.");
    }
  }, [artisanId]);

  useEffect(() => {
    getActiveContracts();
  }, [getActiveContracts]);

  return (
    <>
      <section className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[55%] mx-auto max-w-[1600px]">
        <div className="bg-white relative my-4 h-[100%] sm:min-h-[calc(90vh-80px)] rounded-xl p-4 sm:p-8 md:p-12">
          <div className="absolute top-4 left-4">
            <div
              onClick={() => {
                router.back();
              }}
              className="flex space-x-2 cursor-pointer items-center mb-4"
            >
              <IoMdArrowBack />
              <p>Back</p>
            </div>
          </div>
          <div className="mt-8">
            <h1 className="my-4">Work Hisory</h1>
            {workHistory?.length === 0 ? (
              <p></p>
            ) : workHistory.some((client) => client.status === "completed") ? (
              <div>
                {workHistory
                  ?.filter((client) => client.status === "completed")
                  .map((client) => (
                    <Card key={client.client_id} className="w-full my-2">
                      <CardContent className="pt-2 flex flex-col space-y-2">
                        <div className="flex items-center">
                          {client.client_image ? (
                            <FetchArtisanImage
                              avatarUrl={client.client_image}
                              bookingImage={true}
                            />
                          ) : (
                            <div className="w-[40px] h-[40px]">
                              <Image
                                src="/noprofile.jpg"
                                alt="Profile"
                                width={100}
                                height={100}
                                priority
                              />
                            </div>
                          )}
                          <div className="ml-2">{client.client_name}</div>
                        </div>
                        <p>
                          <span className="font-semibold mr-2">
                            Client Email:
                          </span>
                          {client.contact_email}
                        </p>
                        <p>
                          <span className="font-semibold mr-2">
                            Client Phone No:
                          </span>
                          {client.phone}
                        </p>
                        <p>
                          <span className="font-semibold mr-2">
                            Completed Date:
                          </span>
                          {client.completed_date}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <p>No work history.</p>
            )}
          </div>
          {error && <p>{error}</p>}
        </div>
      </section>
    </>
  );
};

export default WorkHistory;
