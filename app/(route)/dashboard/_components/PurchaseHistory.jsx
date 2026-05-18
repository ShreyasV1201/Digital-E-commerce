"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import DisplayProductList from "../../../../app/_components/DisplayProductList";

function PurchaseHistory() {
  const [productList, setProductList] = useState([]);

  const getPurchaseHistory = useCallback(async (signal) => {
    const result = await axios.get("/api/order", {
      signal,
    });

    setProductList(Array.isArray(result.data) ? result.data : []);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    getPurchaseHistory(controller.signal).catch((error) => {
      if (
        error?.name === "CanceledError" ||
        error?.code === "ERR_CANCELED"
      ) {
        return;
      }

      console.log(
        "PURCHASE HISTORY ERROR:",
        error?.response?.data || error
      );
    });

    return () => controller.abort();
  }, [getPurchaseHistory]);

  return (
    <div>
      <h2 className="font-bold text-3xl mt-5">
        Purchase History
      </h2>

      <DisplayProductList
        productList={productList}
        purchase={true}
      />
    </div>
  );
}

export default PurchaseHistory;