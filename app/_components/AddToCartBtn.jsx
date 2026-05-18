"use client";

import { useContext, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import ProductEditableOption from "./ProductEditableOption";
import { MoreVerticalIcon } from "lucide-react";
import { CartContext } from "../_context/CartContext";

function AddToCartBtn({ editable, product }) {
  const { user } = useUser();
  const { setCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const AddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);

      const res = await axios.post("/api/cart", {
        email: user?.primaryEmailAddress?.emailAddress,
        productId: product?.id,
      });

      setCart((prev) => [...prev, res.data]);
    } catch (error) {
      console.log("Add to cart failed:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // MOVE IT HERE
  const DeleteProduct = async () => {
    try {
      console.log(product);

      const result = await axios.delete('/api/products', {
        data: {
          productId: product?.id,
        },
      });

      console.log(result);

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  if (editable) {
    return (
      <div>
        <ProductEditableOption onDelete={DeleteProduct}>
          <button type="button" className="cursor-pointer">
            <MoreVerticalIcon />
          </button>
        </ProductEditableOption>
      </div>
    );
  }

  return (
    <Button size="sm" className="mt-1" disabled={loading} onClick={AddToCart}>
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}

export default AddToCartBtn;