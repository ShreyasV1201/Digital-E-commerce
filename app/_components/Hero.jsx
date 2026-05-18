import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

function Hero() {
  return (
    <div className="bg-[oklch(21.6%_0.006_56.043)] px-4 py-10 md:px-16 lg:px-36">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 md:pt-20">

        {/* Text Section */}
        <div>
          <h2 className="font-extrabold text-3xl md:text-5xl text-white leading-tight">
            Speed Up your Creative Workflow
          </h2>

          <p className="text-sm md:text-base font-medium leading-relaxed text-[oklch(71.2%_0.194_13.428)] mt-3">
            Join a growing family of 43,436 designers, creators and makers from around the world
          </p>

          <div className="flex gap-3 md:gap-4 mt-5">
            <Link href={'/explore'}>
            <Button className="text-sm md:text-base">Explore</Button>
            </Link>
            <Link href={'/dashboard'}>
            <Button className="text-sm md:text-base">Sell</Button>
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex items-center justify-center">
          <Image
            src="/pc1.png"
            alt="pc"
            width={280}
            height={280}
            className="md:w-[300px] md:h-[260px]"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
