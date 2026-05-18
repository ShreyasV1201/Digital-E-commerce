"use client";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import DisplayProductList from "@/app/_components/DisplayProductList";

function SimilarProduct({ category, productId }) {
  const [productList, setProductList] = useState([]);

  const GetSimilarProductList = useCallback(
    async (signal) => {
      if (!category || !productId) return;

      const result = await axios.get(
        `/api/products?category=${category}&productId=${productId}`,
        { signal }
      );

      setProductList(Array.isArray(result.data) ? result.data : []);
    },
    [category, productId]
  );

  useEffect(() => {
    const controller = new AbortController();

    if (category) {
      GetSimilarProductList(controller.signal).catch((error) => {
        if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") return;
        console.log("SIMILAR PRODUCT ERROR:", error?.response?.data || error);
      });
    } else {
      setProductList([]);
    }

    return () => controller.abort();
  }, [GetSimilarProductList, category]);

  return (
    <div>
      <h2 className="font-bold text-3xl mb-5">Similar Product</h2>

      {productList?.length > 0 ? (
        <DisplayProductList productList={productList} />
      ) : (
        <p>No similar products found</p>
      )}
    </div>
  );
}

export default SimilarProduct;