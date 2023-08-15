import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="w-[95%] sm:w-[90%] mx-auto max-w-[1600px]">
        <div className="my-8">
          <h1>Atwist</h1>
          <div className="flex flex-col-reverse md:flex-row md:justify-between space-y-6 md:space-y-0">
            <div className="">
              <h1></h1>
              <p></p>
              <div className="flex space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-1 text-center rounded-md"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-1 text-center rounded-md"
                >
                  Get Started
                </Link>
              </div>
            </div>
            <div className=""></div>
          </div>
        </div>
      </section>
    </main>
  );
}
