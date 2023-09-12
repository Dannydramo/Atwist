"use client";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Signup = () => {
	const router = useRouter();
	const [artisanBorderCol, setArtisanBorderCol] = useState<boolean>(false);
	const [clientBorderCol, setClientBorderCol] = useState<boolean>(false);
	const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
	const [buttonText, setButtonText] = useState<string>("Create Account");
	let selectedOptionRef = "";

	const handleOptionClick = (value: string) => {
		selectedOptionRef = value;
		if (selectedOptionRef === "artisan") {
			setButtonDisabled(false);
			setButtonText("Join as an artisan");
			setArtisanBorderCol(true);
			setClientBorderCol(false);
		} else if (selectedOptionRef === "client") {
			setButtonDisabled(false);
			setButtonText("Join as a client");
			setArtisanBorderCol(false);
			setClientBorderCol(true);
		}
	};

	const handlePageChange = () => {
		buttonText === "Join as an artisan"
			? router.push("/artisan-signup")
			: router.push("/client-signup");
	};

	return (
		<section className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] mx-auto max-w-[1600px]">
			<div className="bg-white my-4 h-[100%] sm:min-h-[calc(90vh-80px)] rounded-xl p-4 sm:p-8 md:p-12">
				<h1 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold">
					Join as a client or artisan
				</h1>

				<RadioGroup
					defaultValue="option-one"
					className="grid gap-4 md:gap-6 xl:gap-8 md:grid-cols-2 my-6 md:my-12"
				>
					<div
						className={`relative p-4 min-h-32 w-full rounded-2xl ${clientBorderCol ? "border border_ring bg-[#ecebf382]" : "border"
							} lg:p-8`}
					>
						<RadioGroupItem
							value="client"
							id="client"
							className="text-[#6272B9] border-[#6272B9] absolute top-4 right-4"
							onClick={() => handleOptionClick("client")}
						/>
						<div className="mt-8 lg:mt-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
							{"I'm"} a client, looking for artisans
						</div>
					</div>
					<div
						className={`relative p-4 min-h-32 w-full rounded-2xl ${artisanBorderCol ? "border border_ring bg-[#ecebf382]" : "border"
							} lg:p-8`}
					>
						<RadioGroupItem
							value="artisan"
							id="artisan"
							className="text-[#6272B9] border-[#6272B9] absolute top-4 right-4"
							onClick={() => handleOptionClick("artisan")}
						/>
						<div className="mt-8 lg:mt-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
							{"I'm"} an artisan, looking for job
						</div>
					</div>
				</RadioGroup>

				<Button
					type="button"
					disabled={buttonDisabled}
					onClick={handlePageChange}
					className="w-[230px] flex justify-center text-sm md:text-base mx-auto text-center mt-8 rounded-[3rem] bg-[#6272B9]"
				>
					{buttonText}
				</Button>
				<div className="flex text-base space-x-1 justify-center mt-4">
					<p>Already have an account?</p>
					<Link href="/login" className="text-[#6272B9] underline">
						Log in
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Signup;
