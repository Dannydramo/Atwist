"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import supabase from "@/lib/supabase";
import ProfileUpload from "@/components/ProfileUpload";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { userDetails } from "@/types";
import { IoMdArrowBack } from "react-icons/io";

const EditProfile = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const userId = searchParams.get("id") ?? "";
	const [updateProfileDetails, setUpdateProfileDetails] = useState({
		locationText: "",
		descriptionText: "",
		facebookLink: "",
		instagramLink: "",
		twitterLink: "",
		linkedinLink: "",
	});
	const editProfileImage = true;
	const { toast } = useToast();
	const [userDetails, setUserDetails] = useState<userDetails>();

	useEffect(() => {
		const fetchUserDetails = async () => {
			if (!userId) {
				return;
			}

			try {
				const { data, error } = await supabase
					.from("profiles")
					.select()
					.eq("id", userId);
				if (error) {
					throw error;
				}
				if (data) {
					setUserDetails(data[0]);
					setUpdateProfileDetails({
						locationText: userDetails?.location ?? "",
						descriptionText: userDetails?.description ?? "",
						facebookLink: userDetails?.facebook ?? "",
						instagramLink: userDetails?.instagram ?? "",
						twitterLink: userDetails?.twitter ?? "",
						linkedinLink: userDetails?.linkedIn ?? "",
					});
				}
			} catch (error: any) {
				console.log(error.message);
			}
		};
		fetchUserDetails();
	}, [
		userDetails?.description,
		userDetails?.facebook,
		userDetails?.instagram,
		userDetails?.linkedIn,
		userDetails?.location,
		userDetails?.twitter,
		userId,
	]);

	const handleUpdate = async () => {
		const {
			descriptionText,
			locationText,
			twitterLink,
			linkedinLink,
			instagramLink,
			facebookLink,
		} = updateProfileDetails;
		try {
			const { error } = await supabase.from("profiles").upsert({
				id: userId,
				description: descriptionText,
				location: locationText,
				twitter: twitterLink,
				linkedIn: linkedinLink,
				facebook: facebookLink,
				instagram: instagramLink,
			});
			if (error) {
				throw error;
			} else {
				toast({
					description: "Update Successful",
				});
			}
		} catch (error: any) {
			toast({
				variant: "destructive",
				description: error.message,
			});
			console.log(error.message);
		}
	};

	return (
		<>
			<section className="w-[95%] sm:w-[80%] md:w-[75%] lg:w-[65%] mx-auto max-w-[1600px]">
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
						<ProfileUpload userId={userId} edit={editProfileImage} />
						<Textarea
							value={updateProfileDetails.descriptionText}
							placeholder="Enter bio"
							className="text-base my-3 border-t-none outline-none"
							onChange={(e) => {
								setUpdateProfileDetails({
									...updateProfileDetails,
									descriptionText: e.target.value,
								});
							}}
						/>
						<Input
							value={updateProfileDetails.locationText}
							className="text-base my-3 border-t-none outline-none"
							placeholder="Enter location"
							onChange={(e) => {
								setUpdateProfileDetails({
									...updateProfileDetails,
									locationText: e.target.value,
								});
							}}
						/>
						<div className="text-base">
							Link to social media accounts
							<Input
								value={updateProfileDetails.instagramLink}
								className="text-base my-3 border-t-none outline-none"
								placeholder="Instagram"
								onChange={(e) => {
									setUpdateProfileDetails({
										...updateProfileDetails,
										instagramLink: e.target.value,
									});
								}}
							/>
							<Input
								value={updateProfileDetails.twitterLink}
								className="text-base my-3 border-t-none outline-none"
								placeholder="Twitter"
								onChange={(e) => {
									setUpdateProfileDetails({
										...updateProfileDetails,
										twitterLink: e.target.value,
									});
								}}
							/>
							<Input
								value={updateProfileDetails.linkedinLink}
								className="text-base my-3 border-t-none outline-none"
								placeholder="LinkedIn"
								onChange={(e) => {
									setUpdateProfileDetails({
										...updateProfileDetails,
										linkedinLink: e.target.value,
									});
								}}
							/>
							<Input
								value={updateProfileDetails.facebookLink}
								className="my-3 border-t-none text-base outline-none"
								placeholder="Facebook"
								onChange={(e) => {
									setUpdateProfileDetails({
										...updateProfileDetails,
										facebookLink: e.target.value,
									});
								}}
							/>
						</div>
						<Button
							type="button"
							className="bg-[#6272B9] text-base mt-4 text-white py-1 px-6 rounded-md text-center"
							onClick={handleUpdate}
						>
							Update Profile
						</Button>
					</div>
				</div>
			</section>
		</>
	);
};

export default EditProfile;
