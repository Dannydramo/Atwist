"use client";

import supabase from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Artisan, BookingData, ClientDetails } from "@/types";
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

const ActiveContract = () => {
  const searchParams = useSearchParams();
  const artisanId = searchParams.get("id") ?? "";
  const [bookedClients, setBookedClients] = useState<BookingData[]>([]);
  const [activeContracts, setActiveContracts] = useState<ClientDetails[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getContracts = useCallback(async () => {
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
    } catch (error: any) {
      console.log(error.message);
      setError("Error fetching contracts. Please try again later.");
    }
  }, [artisanId]);

  const getActiveContracts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("active_contract")
        .eq("id", artisanId);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setActiveContracts(data[0].active_contract);
      }
    } catch (error: any) {
      console.error("Error fetching active contracts:", error.message);
      setError("Error fetching active contracts. Please try again later.");
    }
  }, [artisanId]);

  useEffect(() => {
    getContracts();
    getActiveContracts();
  }, [artisanId, getActiveContracts, getContracts]);

  const handleApprove = async (clientId: string) => {
    try {
      const bookingToUpdate = bookedClients.find((booking) =>
        booking.pending_contract.some((client) => client.client_id === clientId)
      );

      if (!bookingToUpdate) {
        console.error("Booking not found.");
        return;
      }

      const updatedPendingContract = bookingToUpdate.pending_contract.filter(
        (client) => client.client_id !== clientId
      );

      const approvedClient = bookingToUpdate.pending_contract.find(
        (client) => client.client_id === clientId
      );

      if (!approvedClient) {
        console.error("Client not found in the pending_contract.");
        return;
      }

      approvedClient.status = "approved";

      const updatedActiveContract = [
        ...(bookingToUpdate.active_contract || []),
        approvedClient,
      ];

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

      // Update the bookedClients state with the updated data
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
      getActiveContracts();
      getContracts();
    } catch (error: any) {
      console.error("Error approving booking:", error.message);
    }
  };

  const handleDecline = async (clientId: string) => {
    try {
      const bookingToUpdate = bookedClients.find((booking) =>
        booking.pending_contract.some((client) => client.client_id === clientId)
      );

      if (!bookingToUpdate) {
        console.error("Booking not found.");
        return;
      }

      const updatedPendingContract = bookingToUpdate.pending_contract.filter(
        (client) => client.client_id !== clientId
      );

      // Update the booking record in Supabase
      const { error } = await supabase
        .from("bookings")
        .update({
          pending_contract: updatedPendingContract,
        })
        .eq("id", bookingToUpdate.id);

      if (error) {
        throw error;
      }

      // Update the bookedClients state with the updated data
      const updatedClients = bookedClients.map((booking) =>
        booking.id === bookingToUpdate.id
          ? {
              ...booking,
              pending_contract: updatedPendingContract,
            }
          : booking
      );
      setBookedClients(updatedClients);
    } catch (error: any) {
      console.error("Error declining booking:", error.message);
    }
  };

  const handleCompleted = async (clientId: string) => {
    try {
      const bookingToUpdate = bookedClients.find((booking) =>
        booking.active_contract.some((client) => client.client_id === clientId)
      );

      if (!bookingToUpdate) {
        console.error("Booking not found.");
        return;
      }

      const updatedActiveContract = bookingToUpdate.active_contract.filter(
        (client) => client.client_id !== clientId
      );

      // Update the booking record in Supabase
      const { error } = await supabase
        .from("bookings")
        .update({
          active_contract: updatedActiveContract,
        })
        .eq("id", bookingToUpdate.id);

      if (error) {
        throw error;
      }

      // Update the bookedClients state with the updated data
      const updatedClients = bookedClients.map((booking) =>
        booking.id === bookingToUpdate.id
          ? {
              ...booking,
              active_contract: updatedActiveContract,
            }
          : booking
      );
      setBookedClients(updatedClients);
    } catch (error: any) {
      console.error("Error completing project:", error.message);
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
                      <TableHead>Email</TableHead>
                      <TableHead>Client Phone No</TableHead>
                      <TableHead>Client Name</TableHead>
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
                            <TableCell>{client.client_name}</TableCell>
                            <TableCell>{client.contact_email}</TableCell>
                            <TableCell>{client.phone}</TableCell>
                            <TableCell>{client.date}</TableCell>
                            {client.status === "pending" && (
                              <TableCell className="justify-end flex space-x-1">
                                <Button
                                  id={client.client_id}
                                  onClick={() =>
                                    handleApprove(client?.client_id)
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  id={client.client_id}
                                  onClick={() =>
                                    handleDecline(client?.client_id)
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
                      <TableHead className="w-[100px]">S/N</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Client Phone No</TableHead>
                      <TableHead>Client Name</TableHead>
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
                          <TableCell>{client.client_name}</TableCell>
                          <TableCell>{client.contact_email}</TableCell>
                          <TableCell>{client.phone}</TableCell>
                          <TableCell>{client.date}</TableCell>
                          {client.status === "approved" && (
                            <TableCell>
                              {" "}
                              <Button
                                onClick={() =>
                                  client.client_id &&
                                  handleCompleted(client.client_id)
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
