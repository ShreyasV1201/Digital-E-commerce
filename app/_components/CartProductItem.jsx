import { Card } from "@/components/ui/card";
import axios from "axios";
import Image from "next/image";
import React, { useContext } from "react";
import { CartContext } from "../_context/CartContext";
import { toast } from "sonner";

function CartProductItem({ product }) {
  const { cart, setCart } = useContext(CartContext);

  const removeItem = async () => {
    try {
      const recordId = product?.cartId;

      if (!recordId) {
        toast.error("This cart item is invalid");
        return;
      }

      await axios.delete(`/api/cart?recordId=${recordId}`);

      const updatedCart = cart.filter((item) => item.cartId !== recordId);
      setCart(updatedCart);

      toast.success("Item removed from cart");
    } catch (error) {
      console.log("Delete cart item error", error?.response?.data || error);
      toast.error("Failed to remove item");
    }
  };

  return (
    <Card className="flex gap-5 p-3 items-center">
      {product?.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product?.title || "cart product"}
          width={70}
          height={70}
          className="h-[70px] w-[70px] object-cover rounded-md"
        />
      ) : (
        <div className="h-[70px] w-[70px] bg-gray-200 rounded-md" />
      )}

      <div className="flex flex-col">
        <h2 className="font-bold text-black">{product?.title}</h2>
        <h2 className="text-gray-500">${product?.price}</h2>

        <button
          onClick={removeItem}
          className="text-red-500 text-sm mt-2 text-left hover:underline"
        >
          Remove
        </button>
      </div>
    </Card>
  );
}

export default CartProductItem;