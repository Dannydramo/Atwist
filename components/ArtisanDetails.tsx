"use client";
import { useCallback, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import FetchArtisanImage from "./FetchArtisanImage";
import Proof from "./Proof";
import supabase from "@/lib/supabase";
import { userDetails, BookingData, BookingDetails } from "@/types";
import {
  BiLogoFacebook,
  BiLogoLinkedin,
  BiLogoTwitter,
  BiLogoInstagramAlt,
} from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
interface ArtisanProps {
  artisanDetails: userDetails;
  user: User | null;
  userDetails?: userDetails;
}

const ArtisanDetails: React.FC<ArtisanProps> = ({
  artisanDetails,
  user,
  userDetails,
}) => {
  const {
    id,
    avatar_url,
    full_name,
    location,
    email,
    occupation_name,
    phone,
    linkedIn,
    twitter,
    facebook,
    instagram,
  } = artisanDetails;
  const artisanId = id;
  const [existingBooking, setExistingBooking] = useState<BookingData[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [requestContent, setRequestContent] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const checkExistingBooking = useCallback(async () => {
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
  }, [artisanId]);
  useEffect(() => {
    checkExistingBooking();
  }, [checkExistingBooking]);

  useEffect(() => {
    if (existingBooking && existingBooking.length > 0) {
      const pendingClient = existingBooking[0].pending_contract.find(
        (client) => client.client_id === user?.id
      );

      if (pendingClient) {
        setRequestContent("Request Pending");
        setIsButtonDisabled(true);
      } else if (
        existingBooking[0].active_contract?.some(
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

    const formattedDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    const clientDetails: BookingDetails = {
      client_id: user?.id,
      client_name: user?.user_metadata?.full_name,
      contact_email: user?.email,
      phone: user?.user_metadata?.phone,
      client_image: userDetails?.avatar_url,
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

      const bookedClient = [
        ...(existingBooking[0]?.pending_contract || []),
        clientDetails,
      ];

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
        checkExistingBooking();
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
    <section>
      <div className="mt-8">
        <div className="flex items-center space-x-4">
          <FetchArtisanImage avatarUrl={avatar_url} />
          <div>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
              {full_name}
            </p>
            {location && (
              <p className="mb-2 flex items-center space-x-2 text-sm sm:text-base md:text-lg ">
                <CiLocationOn className="h-[20px] w-[20px]" />
                {location}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col mt-2 space-y-1 text-base">
          <p>{occupation_name}</p>
          <a href={`mailto:${email}`}>{email}</a>
          <a href={`tel:${phone}`}>{phone}</a>
        </div>
        <div className="flex space-x-3">
          {facebook && (
            <a href={`${facebook}`} target="_blank" rel="noopener noreferrer">
              <BiLogoFacebook className="h-[30px] w-[30px]" />
            </a>
          )}
          {linkedIn && (
            <a href={`${linkedIn}`} target="_blank" rel="noopener noreferrer">
              <BiLogoLinkedin className="h-[30px] w-[30px]" />
            </a>
          )}
          {twitter && (
            <a href={`${twitter}`} target="_blank" rel="noopener noreferrer">
              <BiLogoTwitter className="h-[30px] w-[30px]" />
            </a>
          )}
          {instagram && (
            <a href={`${instagram}`} target="_blank" rel="noopener noreferrer">
              <BiLogoInstagramAlt className="h-[30px] w-[30px]" />
            </a>
          )}
        </div>
        <div className="mt-2">
          <Button
            onClick={bookArtisan}
            className="bg-[#6272B9] mt-3 text-sm md:text-base text-white py-1 px-6 rounded-md text-center"
            disabled={isButtonDisabled || loading}
          >
            {loading ? "Making Request" : requestContent}
          </Button>
        </div>
        <Proof userId={id} artisanFullName={full_name} isClient={true} />
      </div>
    </section>
  );
};

export default ArtisanDetails;
