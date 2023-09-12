import React from "react";
import { TableCell } from "@/components/ui/table";
import FetchArtisanImage from "./FetchArtisanImage";
import { Button } from "./ui/button";
import Image from "next/image";
import { TableContentProps } from "@/types";

const TableContent = ({
	avatarUrl,
	clientName,
	clientEmail,
	clientId,
	clientPhone,
	clientStatus,
	index,
	bookingDate,
	handleApprove,
	handleDecline,
	handleCompleted,
}: TableContentProps) => {
	return (
		<>
			<TableCell>{index + 1}</TableCell>
			<TableCell>
				<div className="flex items-center">
					{avatarUrl ? (
						<FetchArtisanImage avatarUrl={avatarUrl} bookingImage={true} />
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
					<div className="ml-2">{clientName}</div>
				</div>
			</TableCell>
			<TableCell>{clientEmail}</TableCell>
			<TableCell>{clientPhone}</TableCell>

			<TableCell>{bookingDate}</TableCell>
			{clientStatus === "pending" && (
				<TableCell className="justify-end text-right flex space-x-1">
					<Button
						className="bg-green-500 rounded-3xl hover:bg-green-500"
						id={clientId}
						onClick={() => clientId && handleApprove && handleApprove(clientId)}
					>
						Approve
					</Button>
					<Button
						className="bg-red-500 rounded-3xl hover:bg-red-500"
						id={clientId}
						onClick={() => clientId && handleDecline && handleDecline(clientId)}
					>
						Decline
					</Button>
				</TableCell>
			)}
			{clientStatus === "approved" && (
				<TableCell className="text-right">
					<Button
						onClick={() =>
							clientId && handleCompleted && handleCompleted(clientId)
						}
					>
						Complete Task
					</Button>
				</TableCell>
			)}
		</>
	);
};

export default TableContent;
