import Image from "next/image";

export default function Hero() {
  return (
    <section className="container my-9 flex flex-col md:flex-row items-center justify-between gap-8 animate-fadeIn">
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-5xl sm:text-3xl md:text-5xl mb-5 font-bold leading-tight overflow-hidden whitespace-nowrap border-r-4 border-primary animate-typing">
          Find Your Next <br /> Dream Job
        </h1>
        <p className="text-gray-600 mt-2 text-lg lg:text-xl md:text-2xl text-justify animate-fadeIn">
          Explore diverse job opportunities that align with your skills and passion, connecting you with top employers and the latest openings to achieve your career goals.
        </p>
        <form className="flex w-full flex-col md:flex-row gap-2 mt-4 max-w-md mx-auto md:mx-0 animate-slideIn" aria-label="Job search">
          <input
            type="search"
            className="border border-gray-400 w-full py-2 px-3 rounded-md"
            placeholder="Search for jobs..."
            aria-label="Search jobs"
          />
          <button className="bg-blue-600 text-white py-2 px-4 rounded-md">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1">
        <Image
          src="/assets/heroimage.png"
          alt="Illustration of job search"
          width={500}
          height={500}
          className="object-cover w-full h-auto animate-3d"
        />
      </div>
    </section>
  );
}
