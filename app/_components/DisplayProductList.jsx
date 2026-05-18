"use client";

import { memo, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import ProductCardItem from "./ProductCardItem";

function DisplayProductList({ productList, purchase = false }) {
  const { user } = useUser();

  const skeletons = useMemo(() => [1, 2, 3, 4, 5, 6], []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-5">
      {productList?.length > 0
        ? productList.map((product, index) => (
            <ProductCardItem
              product={product}
              key={`${product.id}-${index}`}
              user={user}
              purchase={purchase}
            />
          ))
        : skeletons.map((item, index) => (
            <div
              key={index}
              className="h-[200px] w-full bg-slate-200 rounded-lg animate-pulse"
            />
          ))}
    </div>
  );
}

export default memo(DisplayProductList);