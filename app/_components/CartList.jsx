"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useContext } from "react";
import { CartContext } from "../_context/CartContext";
import CartProductItem from "./CartProductItem";
import Link from "next/link";

function CartList({ children }) {
  const { cart } = useContext(CartContext);

  const calculateTotal = () => {
    let total = 0;

    cart.forEach((item) => {
      total = total + Number(item?.price);
    });

    return total;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </SheetTrigger>

      <SheetContent
        side="right"
        style={{ width: "400px", maxWidth: "none", background: "white", right: 0 }}
        className="z-[9999]"
      >
        <SheetHeader>
          <SheetTitle>Cart ({cart?.length})</SheetTitle>
        </SheetHeader>

        <p className="text-sm text-gray-500 mt-2">
          All your cart items listed here
        </p>

        <div className="mt-5">
          {cart?.length > 0 ? (
            <>
              <div className="flex flex-col gap-4">
                {cart.map((product, index) => (
                  <CartProductItem key={index} product={product} />
                ))}
              </div>

              <div className="mt-10 border-t pt-5 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-700">Total :</h2>
                <h2 className="text-2xl font-bold text-gray-700">
                  ${calculateTotal()}
                </h2>
              </div>

              <div className="mt-5">
              <Link href={'/checkout'}>
                <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
                  Checkout
                </button>
                </Link>
              </div>
            </>
          ) : (
            <p className="text-black mt-5">Your cart is empty</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CartList;