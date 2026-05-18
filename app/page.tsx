import {Button} from "@/components/ui/button"
import Image from "next/image";
import Hero from "@/app/_components/Hero";
import ProductsList from "./_components/ProductsList"

export default function Home() {
  return (
    <div>
      <Hero/>

      <div className="p-10 md:px-36 lg:px-48">
        <ProductsList/>
      </div>
    </div>
  );
}
