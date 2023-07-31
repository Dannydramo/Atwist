"use client";

import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ClientDetails } from "@/types";

const ActiveContract = () => {
  const searchParams = useSearchParams();
  const artisanId = searchParams.get("id") ?? "";
  const [clients, setClients] = useState<ClientDetails[]>();
  useEffect(() => {
    async function getContracts() {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("artisan_id", artisanId);
        if (error) {
          throw error;
        }
        if (data) {
          console.log(data);
          setClients(data);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    }
    getContracts();
  }, [artisanId]);

  return (
    <>
      <section className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] mx-auto max-w-[1600px]">
        <div className="bg-white my-4 h-[100%] sm:min-h-[calc(90vh-80px)] rounded-xl p-4 sm:p-8 md:p-12"></div>
      </section>
    </>
  );
};

export default ActiveContract;
