"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import DisplayProductList from "../../_components/DisplayProductList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SortProducts from "../../_components/SortProducts";

function Explore() {
  const [productList, setProductList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [sortOption, setSortOption] = useState({
      label: "NEWEST",
      field: "id",
      order: "desc",
    });

  useEffect(() => {
    GetProductList(0, sortOption, false);
  }, []);

  const GetProductList = async (
    offset_,
    sortData = sortOption,
    append = true
  ) => {
    try {
      const result = await axios.post("/api/all-products", {
        limit: 6,
        offset: offset_,
        searchText: searchInput,
        sortBy: sortData.field,
        sortOrder: sortData.order,
      });

      if (offset_ === 0 || !append) {
        setProductList(result.data);
      } else {
        setProductList((prev) => [...prev, ...result.data]);
      }
    } catch (error) {
      console.log("GET PRODUCT ERROR:", error);
    }
  };

  return (
    <div className="mt-10 px-10 md:px-16 lg:px-24">
      <h2 className="font-bold text-3xl">Explore</h2>

      <div className="mt-5 mb-5 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <h2>Search :</h2>
          <Input
            placeholder="Search"
            className="w-80"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button
            onClick={() => {
              setOffset(0);
              setProductList([]);
              GetProductList(0, sortOption, false);
            }}
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>

        <SortProducts
          onSortChange={(value) => {
            setSortOption(value);
            setOffset(0);
            setProductList([]);
            GetProductList(0, value, false);
          }}
        />
      </div>

      <DisplayProductList productList={productList} />

      <div className="flex justify-center mt-10 mb-10">
        <Button
          onClick={() => {
            const newOffset = offset + 6;
            setOffset(newOffset);
            GetProductList(newOffset, sortOption, true);
          }}
          className="!bg-red-500 hover:!bg-red-600 !text-white"
        >
          Load More
        </Button>
      </div>
    </div>
  );
}

export default Explore;