"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AddToCartBtn from "./AddToCartBtn";

function ProductCardItem({ product, editable = false, purchase }) {
  if (!product?.imageUrl) return null;

  return (
    <Card className="p-3">
      <Link href={`/explore/${product?.id}`}>
        <Image
          src={product.imageUrl}
          alt={product.title || "product"}
          width={400}
          height={300}
        />

        <div className="mt-3">
          <h2 className="font-bold text-xl line-clamp-1">
            {product.title}
          </h2>

          <h2 className="font-bold text-2xl text-primary">
            ${product?.price}
          </h2>
        </div>
      </Link>

      <div className="mt-3 md:flex justify-between items-center">
        {!purchase &&
          <>
            <div className="md:flex gap-2 items-center">
              {product?.user?.image && (
                <Image
                  src={product.user.image}
                  alt="user"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              )}

              <h2 className="text-sm text-gray-400">
                {product?.user?.name}
              </h2>
            </div>

            <AddToCartBtn editable={editable} product={product} />
          </>}
        {purchase && (
          <Link href={product?.fileUrl}>
            <Button className="w-full">Download Content</Button>
          </Link>
        )}
      </div>
    </Card>
  );
}

export default ProductCardItem;