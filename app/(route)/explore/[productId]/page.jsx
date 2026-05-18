"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUser } from "@clerk/nextjs";
import { CartContext } from "@/app/_context/CartContext";

import SimilarProduct from "./_components/SimilarProduct";
import AddToCartBtn from "../../../_components/AddToCartBtn";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { user } = useUser();
  const { setCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const GetProductDetail = useCallback(async (signal) => {
    if (!productId) return;

    const result = await axios.get(`/api/products?id=${productId}`, { signal });
    setProduct(result?.data ?? null);
  }, [productId]);

  useEffect(() => {
    const controller = new AbortController();

    GetProductDetail(controller.signal).catch((error) => {
      if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") return;
      console.log("PRODUCT DETAIL ERROR:", error?.response?.data || error);
    });

    return () => controller.abort();
  }, [GetProductDetail]);

  const AddToCart = useCallback(async () => {
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
  }, [user?.primaryEmailAddress?.emailAddress, product?.id, setCart]);

  if (!product) return null;

  return (
    <div className="mt-10 px-5 md:px-10 lg:px-20 xl:px-32 max-w-6xl mx-auto">
      <h2>BACK</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-6">
        <Card className="flex items-center justify-center max-h-[400px] p-4 overflow-hidden">
          <Image
            src={product?.imageUrl}
            alt={product?.title || "product image"}
            width={500}
            height={500}
            className="max-h-[400px] w-auto object-contain"
            priority
          />
        </Card>

        <div className="flex flex-col gap-5">
          <div>
            <h1 className="font-bold text-2xl">{product?.title}</h1>
            <Badge className="text-black">{product?.category}</Badge>
          </div>

          <h2 style={{ color: "red" }} className="font-bold text-3xl">
            ${product?.price}
          </h2>

          <p className="text-gray-500 mt-3">
            The {product?.category} will send to your registered email id once you purchase this digital content
          </p>

          <Button
            className="w-full"
            size="lg"
            onClick={AddToCart}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add to Cart"}
          </Button>

          <Accordion type="single" collapsible className="mt-2">
            <AccordionItem value="item-1">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>{product?.description}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>About product</AccordionTrigger>
              <AccordionContent>{product?.about}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="mt-10">
        <SimilarProduct category={product?.category} productId={productId} />
      </div>
    </div>
  );
}

export default ProductDetail;