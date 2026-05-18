"use client"

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import DisplayProductList from "./DisplayProductList";

function ProductsList() {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    GetProductList();
  }, []);

  const GetProductList = async () => {
    const result = await axios.post("/api/products", { limit: 9 });
    console.log(result.data);
    setProductList(result.data);
  };

  return (
    <div>
      <h2 className="font-bold text-xl flex justify-between items-center">
        Featured
        <span><Button>View all</Button></span>
      </h2>

      <DisplayProductList productList={productList} />
    </div>
  );
}

export default ProductsList;