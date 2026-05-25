"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { memo, useContext, useMemo } from "react";
import { CartContext } from "../_context/CartContext";
import CartList from "./CartList";

function Header() {
  const MenuList = useMemo(
    () => [
      { name: "Home", path: "/" },
      
      { name: "Explore", path: "/explore" },
    ],
    []
  );

  const { cart } = useContext(CartContext);

  return (
    <div className="flex p-4 px-4 md:px-16 lg:px-32 bg-primary border-b-2 border-black justify-between items-center">

      {/* Logo */}
      <h2 className="font-bold text-base md:text-lg bg-black text-white px-2 py-1">
        DIGI STORE
      </h2>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-5 px-2 p-1">
        {MenuList.map((menu) => (
          <li
            key={menu.name}
            className="px-2 p-1 cursor-pointer hover:border-2 hover:border-white"
          >
            <Link href={menu.path}>{menu.name}</Link>
          </li>
        ))}
      </ul>

      {/* Right Actions */}
      <div className="flex gap-3 md:gap-5 items-center">
        <CartList>
          <div className="flex items-center gap-1 cursor-pointer">
            <ShoppingBag size={20} />

            <Badge className="bg-black hover:bg-black rounded-full py-1">
              {cart?.length || 0}
            </Badge>
          </div>
        </CartList>

        <Link href="/dashboard">
          <Button className="bg-[oklch(27.8%_0.033_256.848)] hover:bg-blue-600 text-sm md:text-base px-3 md:px-4">
            Start Selling
          </Button>
        </Link>

        <UserButton />
      </div>
    </div>
  );
}

export default memo(Header);