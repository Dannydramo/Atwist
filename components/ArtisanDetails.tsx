"use client";
import { Artisan, Booking, ClientDetails } from "@/types";
import Proof from "./Proof";
import FetchArtisanImage from "./FetchArtisanImage";
import { Button } from "./ui/button";
import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

interface ArtisanProps {
  artisanDetails: Artisan;
  user: User | null;
}
const ArtisanDetails: React.FC<ArtisanProps> = ({ artisanDetails, user }) => {
  const { id, avatar_url, full_name, loaction } = artisanDetails;
  const artisanId = id;
  const [existingBooking, setExistingBooking] = useState<Booking[]>([]);

  useEffect(() => {
    async function checkExistingBooking() {
      try {
        // Check if clients already exists in bookings table
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("artisan_id", artisanId);

        if (error) {
          throw error;
        }

        setExistingBooking(data);
      } catch (error: any) {
        console.error("Error checking existing booking:", error.message);
      }
    }

    checkExistingBooking();
  }, [artisanId]);

  const bookArtisan = async () => {
    const clientDetails: ClientDetails = {
      client_id: user?.id,
      client_name: user?.user_metadata?.full_name,
      contact_email: user?.email,
      phone: user?.user_metadata?.phone,
      date: "2023-07-23",
    };
    try {
      let bookedClient: any[] = [];

      // If client already exists, get the existing details
      if (existingBooking && existingBooking.length > 0) {
        bookedClient = existingBooking[0].client_booking || [];
      }

      // Add the new client details to the array of clientDetails
      bookedClient = [...bookedClient, clientDetails];

      // Insert or update the booking record with the new clientDetails
      const { data: updatedBooking, error: bookingError } = await supabase
        .from("bookings")
        .upsert({
          id: artisanId,
          artisan_id: artisanId,
          client_booking: bookedClient,
        })
        .single();

      if (bookingError) {
        throw bookingError;
      }

      console.log("Booking added/updated successfully:", updatedBooking);
      return updatedBooking;
    } catch (error: any) {
      console.error("Error adding booking:", error.message);
      return null;
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center space-x-4">
          <FetchArtisanImage avatarUrl={avatar_url} />
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
              {full_name}
            </p>
            <p className="mb-2 text-sm sm:text-base md:text-lg ">{loaction}</p>
          </div>
        </div>
        <div className="">
          <Button
            onClick={bookArtisan}
            className="bg-[#6272B9] text-sm md:text-base text-white py-1 px-6 rounded-md text-center"
          >
            Make Request
          </Button>
        </div>
        <Proof userId={id} artisanFullName={full_name} isClient={true} />
      </div>
    </>
  );
};

export default ArtisanDetails;
