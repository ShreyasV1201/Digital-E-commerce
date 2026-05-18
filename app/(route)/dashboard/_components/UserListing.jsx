"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import ProductCardItem from "@/app/_components/ProductCardItem";


function UserListing(){
    const [listing, setListing] = useState([]);
    const [loading,setLoading]= useState(false);
    const {user}=useUser();

    useEffect(()=>{
            user&&getUserProductList();
    },[user])

    const getUserProductList = async () => {
  try {
    setLoading(true);

    const result = await axios.get(
      "/api/products?email=" + user?.primaryEmailAddress?.emailAddress
    );

    console.log(result.data);
    setListing(result.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

    return (
        <div className="mt-5">
            <h2 className="font-bold text-xl flex justify-between items-center">Listing
                <Link href={'/add-product'}>
                    <Button>+Add New Product</Button>
                </Link>
            </h2>

            <div>
                {listing?.length == 0 &&
                    <h2 className="font-medium text-2xl mt-10 text-center text-gray-300">No Listing Found</h2>}

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5">
                        {listing.map((product,index)=>(
                            <ProductCardItem key={index} product={product}
                                editable={true}
                            />
                        ))}
                    </div>
            </div>
        </div>
    )
}

export default UserListing