import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<main>
			<section className="w-[95%] sm:w-[90%] mx-auto max-w-[1600px]">
				<div className="my-8">
					<div className="h-16 md-h-20">
						<h1 className="text-lg">Atwist</h1>
					</div>

					<div className="flex flex-col-reverse space-y-6 md:space-y-0 md:flex-row justify-between md:space-x-8 items-center">
						<div className="sm:w-full md:w-[70%] lg:w-[60%] xl:w-2/5">
							<h1 className="text-3xl sm:text-4xl md:text-5xl">
								Discover Artisan Excellence with Atwist
							</h1>
							<p className="my-4 text-base lg:text-lg">
								Atwist, the ultimate platform that bridges the gap between
								discerning clients and exceptional artisans. Our mission is to
								ignite creativity and foster connections, revolutionizing the
								way you experience craftsmanship. With Atwist, {"you're"} not
								just getting a service – {"you're"} immersing yourself in a
								world of skilled artisans who transform dreams into reality.
							</p>
							<div className="">
								<Link
									href="/login"
									className="mr-4 border border-[#6272B9] hover:text-white hover:bg-[#6272B9] transition duration-700 ease-in rounded-md py-2 px-4 text-base md:text-lg"
								>
									Login
								</Link>
								<Link
									href="/signup"
									className="rounded-md bg-[#6272B9] hover:bg-transparent text-white hover:text-black border hover:border-[#6272B9] transition duration-700 ease-in py-2 px-6 text-base md:text-lg"
								>
									Get Started
								</Link>
							</div>
						</div>
						<div className="">
							<Image
								src="/smiley.jpg"
								height={600}
								width={600}
								alt="Artisan Image"
								className="rounded-[49%] mb-6 md:mb-0"
							/>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
