"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import supabase from "@/lib/supabase";
import { BookingData, ClientDetails } from "@/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FetchArtisanImage from "@/components/FetchArtisanImage";

const ActiveContract = () => {
  const searchParams = useSearchParams();
  const artisanId = searchParams.get("id") ?? "";
  const [bookedClients, setBookedClients] = useState<BookingData[]>([]);
  const [activeContracts, setActiveContracts] = useState<ClientDetails[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch booked clients and active contracts
  const fetchData = useCallback(async () => {
    try {
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .eq("artisan_id", artisanId);

      if (bookingsError) {
        throw bookingsError;
      }

      if (bookingsData) {
        setBookedClients(bookingsData);
      }

      const { data, error: activeContractsError } = await supabase
        .from("bookings")
        .select("active_contract")
        .eq("id", artisanId);

      if (activeContractsError) {
        throw activeContractsError;
      }

      if (data && data.length > 0) {
        setActiveContracts(data[0].active_contract);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
      setError("Error fetching data. Please try again later.");
    }
  }, [artisanId]);

  useEffect(() => {
    fetchData();
  }, [artisanId, fetchData]);

  // Handle approval, decline, and completion
  const handleAction = async (
    action: "approve" | "decline" | "complete",
    clientId: string
  ) => {
    try {
      const bookingToUpdate = bookedClients.find(
        (booking) =>
          booking.pending_contract.some(
            (client) => client.client_id === clientId
          ) ||
          (action === "decline" &&
            booking.active_contract.some(
              (client) => client.client_id === clientId
            ))
      );

      if (!bookingToUpdate) {
        console.error("Booking not found.");
        return;
      }
      let updatedPendingContract = [...bookingToUpdate.pending_contract];
      let updatedActiveContract = [...bookingToUpdate.active_contract];

      if (action === "approve") {
        updatedPendingContract = bookingToUpdate.pending_contract.filter(
          (client) => client.client_id !== clientId
        );

        const approvedClient = bookingToUpdate.pending_contract.find(
          (client) => client.client_id === clientId
        );

        if (approvedClient) {
          approvedClient.status = "approved";
          updatedActiveContract.push(approvedClient);
        }
      } else if (action === "decline") {
        updatedPendingContract = bookingToUpdate.pending_contract.filter(
          (client) => client.client_id !== clientId
        );
      } else if (action === "complete") {
        updatedActiveContract = bookingToUpdate.active_contract.filter(
          (client) => client.client_id !== clientId
        );
      }

      // Update the booking record in Supabase
      const { error } = await supabase
        .from("bookings")
        .update({
          pending_contract: updatedPendingContract,
          active_contract: updatedActiveContract,
        })
        .eq("id", bookingToUpdate.id);

      if (error) {
        throw error;
      }

      const updatedClients = bookedClients.map((booking) =>
        booking.id === bookingToUpdate.id
          ? {
              ...booking,
              pending_contract: updatedPendingContract,
              active_contract: updatedActiveContract,
            }
          : booking
      );

      setBookedClients(updatedClients);
      fetchData();
    } catch (error: any) {
      console.error(`Error ${action}ing booking:`, error.message);
    }
  };

  return (
    <>
      <section className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] mx-auto max-w-[1600px]">
        <div className="bg-white my-4 h-[100%] sm:min-h-[calc(90vh-80px)] rounded-xl p-4 sm:p-8 md:p-12">
          <Tabs defaultValue="pending-contract" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending-contract">
                Pending Contract
              </TabsTrigger>
              <TabsTrigger value="active-contract">Active Contract</TabsTrigger>
            </TabsList>
            <TabsContent value="pending-contract">
              {bookedClients.length === 0 ? (
                <p>No pending contracts available.</p>
              ) : (
                <Table>
                  <TableCaption>A list of your pending contracts.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]">S/N</TableHead>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Client Phone No</TableHead>
                      <TableHead>Booking Date</TableHead>
                      <TableHead className="text-right">
                        Client Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookedClients.map((booking) =>
                      booking.pending_contract
                        .filter((client) => client.status === "pending")
                        .map((client, index) => (
                          <TableRow key={client.client_id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {client.client_image && (
                                  <FetchArtisanImage
                                    avatarUrl={client.client_image}
                                    bookingImage={true}
                                  />
                                )}
                                <div className="ml-2">{client.client_name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{client.contact_email}</TableCell>
                            <TableCell>{client.phone}</TableCell>

                            <TableCell>{client.date}</TableCell>
                            {client.status === "pending" && (
                              <TableCell className="justify-end text-right flex space-x-1">
                                <Button
                                  className="bg-green-500 rounded-3xl hover:bg-green-500"
                                  id={client.client_id}
                                  onClick={() =>
                                    handleAction("approve", client?.client_id)
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  className="bg-red-500 rounded-3xl hover:bg-red-500"
                                  id={client.client_id}
                                  onClick={() =>
                                    handleAction("decline", client?.client_id)
                                  }
                                >
                                  Decline
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            <TabsContent value="active-contract">
              {activeContracts?.length === 0 ? (
                <p>No active contracts available.</p>
              ) : (
                <Table>
                  <TableCaption>A list of your active contracts.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30px]">S/N</TableHead>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Client Phone No</TableHead>
                      <TableHead>Booking Date</TableHead>
                      <TableHead className="text-right">
                        Client Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeContracts
                      ?.filter((client) => client.status === "approved")
                      .map((client, index) => (
                        <TableRow key={client.client_id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {client.client_image && (
                                <FetchArtisanImage
                                  avatarUrl={client.client_image}
                                  bookingImage={true}
                                />
                              )}
                              <div className="ml-2">{client.client_name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{client.contact_email}</TableCell>
                          <TableCell>{client.phone}</TableCell>

                          <TableCell>{client.date}</TableCell>
                          {client.status === "approved" && (
                            <TableCell className="text-right">
                              <Button
                                onClick={() =>
                                  client.client_id &&
                                  handleAction("complete", client.client_id)
                                }
                              >
                                Complete Task
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
          {error && <p>{error}</p>}
        </div>
      </section>
    </>
  );
};

export default ActiveContract;
