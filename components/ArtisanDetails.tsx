"use client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import FetchArtisanImage from "./FetchArtisanImage";
import Proof from "./Proof";
import supabase from "@/lib/supabase";
import { Artisan, Booking, ClientDetails } from "@/types";

interface ArtisanProps {
  artisanDetails: Artisan;
  user: User | null;
}

const ArtisanDetails: React.FC<ArtisanProps> = ({ artisanDetails, user }) => {
  const { id, avatar_url, full_name, loaction } = artisanDetails;
  const artisanId = id;
  const [existingBooking, setExistingBooking] = useState<Booking[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [requestContent, setRequestContent] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  useEffect(() => {
    async function checkExistingBooking() {
      try {
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

  useEffect(() => {
    if (existingBooking && existingBooking.length > 0) {
      const pendingClient = existingBooking[0].pending_contract.find(
        (client) => client.client_id === user?.id
      );

      if (pendingClient) {
        setRequestContent("Request Pending");
        setIsButtonDisabled(true);
      } else if (
        existingBooking[0].active_contract.some(
          (client) => client.client_id === user?.id
        )
      ) {
        setRequestContent("Contract Active");
        setIsButtonDisabled(true);
      } else {
        setRequestContent("Make Request");
        setIsButtonDisabled(false);
      }
    } else {
      setRequestContent("Make Request");
      setIsButtonDisabled(false);
    }
  }, [existingBooking, user]);

  const bookArtisan = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedDate = `${year}-${month}-${day}`;

    const clientDetails: ClientDetails = {
      client_id: user?.id,
      client_name: user?.user_metadata?.full_name,
      contact_email: user?.email,
      phone: user?.user_metadata?.phone,
      date: formattedDate,
      status: "pending",
    };
    try {
      setLoading(true);
      toast({
        description: "Making request",
      });
      setRequestContent("Making Request");
      setIsButtonDisabled(true);
      let bookedClient: any[] = [];

      if (existingBooking && existingBooking.length > 0) {
        bookedClient = existingBooking[0].pending_contract || [];
      }

      bookedClient = [...bookedClient, clientDetails];

      const { data: updatedBooking, error: bookingError } = await supabase
        .from("bookings")
        .upsert({
          id: artisanId,
          artisan_id: artisanId,
          pending_contract: bookedClient,
        })
        .single();

      if (bookingError) {
        throw bookingError;
      }
      if (updatedBooking) {
        setLoading(false);
        setRequestContent("Request Sent");
        console.log("Booking added/updated successfully:", updatedBooking);
        return updatedBooking;
      }
    } catch (error: any) {
      console.error("Error adding booking:", error.message);
      toast({
        variant: "destructive",
        description: error.message,
      });
      setLoading(false);
      setIsButtonDisabled(false);
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
            disabled={isButtonDisabled || loading}
          >
            {loading ? "Making Request" : requestContent}
          </Button>
        </div>
        <Proof userId={id} artisanFullName={full_name} isClient={true} />
      </div>
    </>
  );
};

export default ArtisanDetails;
