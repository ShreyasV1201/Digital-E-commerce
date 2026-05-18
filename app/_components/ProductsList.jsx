"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import DisplayProductList from "./DisplayProductList";

function ProductsList() {
  const [productList, setProductList] = useState([]);

  const GetProductList = useCallback(async (signal) => {
    const result = await axios.post("/api/products", { limit: 9 }, { signal });
    setProductList(Array.isArray(result.data) ? result.data : []);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    GetProductList(controller.signal).catch((error) => {
      if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") return;
      console.log("PRODUCT LIST ERROR:", error?.response?.data || error);
    });

    return () => controller.abort();
  }, [GetProductList]);

  return (
    <div>
      <h2 className="font-bold text-xl flex justify-between items-center">
        Featured
        <span>
          <Button>View all</Button>
        </span>
      </h2>

      <DisplayProductList productList={productList} />
    </div>
  );
}

export default ProductsList;