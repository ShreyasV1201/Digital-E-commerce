"use client";

import React, { useContext } from "react";
import { CartContext } from "../_context/CartContext";
import axios from "axios";
import { toast } from "sonner";

function RemoveFromCart({ product }) {
  const { cart, setCart } = useContext(CartContext);

  const removeItem = async () => {
    try {
      const recordId = product?.cartId;

      if (!recordId) {
        toast.error("This cart item is invalid");
        return;
      }

      await axios.delete(`/api/cart?recordId=${recordId}`);

      const updatedCart = cart.filter(
        (item) => item.cartId !== recordId
      );
      setCart(updatedCart);

      toast.success("Item removed from cart");
    } catch (error) {
      console.log("Delete cart item error", error?.response?.data || error);
      toast.error("Failed to remove item");
    }
  };

  return (
    <h2
      className="text-red-500 cursor-pointer hover:underline"
      onClick={removeItem}
    >
      Remove
    </h2>
  );
}

export default RemoveFromCart;