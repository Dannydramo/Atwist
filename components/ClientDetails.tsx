"use client";
import { useEffect, useState } from "react";
import EditClientDetails from "./EditClientDetails";
import ProfileUpload from "./ProfileUpload";
import { Button } from "./ui/button";
import {
	BiLogoFacebook,
	BiLogoInstagramAlt,
	BiLogoLinkedin,
	BiLogoTwitter,
} from "react-icons/bi";
import supabase from "@/lib/supabase";
import { userDetails } from "@/types";
import { useRouter } from "next/navigation";
interface clientProfile {
	userId: string;
	userName: string;
	userPhone: string;
}

const ClientDetails = ({ userId, userName, userPhone }: clientProfile) => {
	const [editPopUp, setEditPopUp] = useState(false);
	const [userDetails, setUserDetails] = useState<userDetails>();
	const router = useRouter();

	useEffect(() => {
		const fetchUserDetails = async () => {
			const { data, error } = await supabase
				.from("profiles")
				.select()
				.eq("id", userId);

			if (data) {
				setUserDetails(data[0]);
			} else {
				console.log(error.message);
			}
		};
		fetchUserDetails();
	}, [userId]);

	const handleSignOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) {
				throw error;
			}
			if (!error) {
				router.push("/login");
				console.log("SignOut successful");
			}
		} catch (error: any) {
			console.log(error.message);
		}
	};

	return (
		<section>
			{editPopUp && (
				<EditClientDetails userId={userId} setEditPopUp={setEditPopUp} />
			)}

			<div className="bg-white my-4 h-[100%] md:max-h-[500px] md:min-w-[300px] rounded-xl p-4 sm:p-8">
				<ProfileUpload userId={userId} />
				<div className="my-3">
					<p>{userName}</p>
					<p>{userPhone}</p>
				</div>
				<div className="flex my-3 space-x-3">
					{userDetails?.facebook && (
						<a
							href={`${userDetails.facebook}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<BiLogoFacebook className="h-[30px] w-[30px]" />
						</a>
					)}
					{userDetails?.linkedIn && (
						<a
							href={`${userDetails.linkedIn}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<BiLogoLinkedin className="h-[30px] w-[30px]" />
						</a>
					)}
					{userDetails?.twitter && (
						<a
							href={`${userDetails.twitter}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<BiLogoTwitter className="h-[30px] w-[30px]" />
						</a>
					)}
					{userDetails?.instagram && (
						<a
							href={`${userDetails.instagram}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<BiLogoInstagramAlt className="h-[30px] w-[30px]" />
						</a>
					)}
				</div>
				<div className="flex space-x-6">
					<Button
						onClick={() => setEditPopUp(true)}
						className="border text-base border-[#6272B9] bg-transparent text-black outline-none hover:bg-[#6272B9] hover:text-white duration-500 ease-in rounded-[20px] text-center"
					>
						Edit Profile
					</Button>
					<Button
						onClick={handleSignOut}
						className="border text-base  bg-red-500 mt-6  text-black outline-none border-red-500 rounded-[20px] text-center"
					>
						Signout
					</Button>
				</div>
			</div>
		</section>
	);
};

export default ClientDetails;
