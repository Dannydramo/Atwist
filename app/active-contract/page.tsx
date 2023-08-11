"use client";

import supabase from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookingData, BookingDetails } from "@/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
import { IoMdArrowBack } from "react-icons/io";

const ActiveContract = () => {
  const searchParams = useSearchParams();
  const artisanId = searchParams.get("id") ?? "";
  const router = useRouter();
  const [bookedClients, setBookedClients] = useState<BookingData[]>([]);
  const [activeContracts, setActiveContracts] = useState<BookingDetails[]>([]);
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

      const completedClient = bookingToUpdate.active_contract.find(
        (client) => client.client_id === clientId
      );

      if (!completedClient) {
        console.error("Client not found in the active_contract.");
        return;
      }
      const date = new Date();

      const formattedDate = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;

      // Update the completed client's date to the current date
      completedClient.completed_date = formattedDate;
      // Move the completed client to work_history
      const updatedWorkHistory = [
        ...(bookingToUpdate.completed_contract || []),
        completedClient,
      ];

      const updatedActiveContract = bookingToUpdate.active_contract.filter(
        (client) => client.client_id !== clientId
      );

      // Update the booking record in Supabase
      const { error } = await supabase
        .from("bookings")
        .update({
          active_contract: updatedActiveContract,
          completed_contract: updatedWorkHistory, // Add the completed client to work_history
        })
        .eq("id", bookingToUpdate.id);

      if (error) {
        throw error;
      } else {
        console.log("Moved to work history");
      }

      // Update the bookedClients state with the updated data
      const updatedClients = bookedClients.map((booking) =>
        booking.id === bookingToUpdate.id
          ? {
              ...booking,
              active_contract: updatedActiveContract,
              completed_contract: updatedWorkHistory, // Add the completed client to work_history
            }
          : booking
      );
      setBookedClients(updatedClients);
      console.log(bookedClients);

      getActiveContracts();
      getContracts();
    } catch (error: any) {
      console.error("Error completing project:", error.message);
    }
  };
  return (
    <>
      <section className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] mx-auto max-w-[1600px]">
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
          <Tabs defaultValue="pending-contract" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending-contract">
                Pending Contract
              </TabsTrigger>
              <TabsTrigger value="active-contract">Active Contract</TabsTrigger>
            </TabsList>
            <TabsContent value="pending-contract">
              {bookedClients.length === 0 ? (
                <p>No pending contracts available.</p>
              ) : bookedClients.some((booking) =>
                  booking.pending_contract.some(
                    (client) => client.status === "pending"
                  )
                ) ? (
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
                                    client.client_id &&
                                    handleApprove(client?.client_id)
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  className="bg-red-500 rounded-3xl hover:bg-red-500"
                                  id={client.client_id}
                                  onClick={() =>
                                    client.client_id &&
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
              ) : (
                <p>No pending contracts available.</p>
              )}
            </TabsContent>

            <TabsContent value="active-contract">
              {activeContracts?.length === 0 ? (
                <p>No active contracts available.</p>
              ) : activeContracts.some(
                  (client) => client.status === "approved"
                ) ? (
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
                          </TableCell>
                          <TableCell>{client.contact_email}</TableCell>
                          <TableCell>{client.phone}</TableCell>

                          <TableCell>{client.date}</TableCell>
                          {client.status === "approved" && (
                            <TableCell className="text-right">
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
              ) : (
                <p>No active contracts available.</p>
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
