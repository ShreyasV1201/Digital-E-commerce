"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"
import DisplayProductList from "@/app/_components/DisplayProductList"

function SimilarProduct({ category, productId }) {
  const [productList, setProductList] = useState([])

  useEffect(() => {
    if (category) {
      GetSimilarProductList()
    }
  }, [category, productId])

  const GetSimilarProductList = async () => {
    try {
      const result = await axios.get(
        "/api/products?category=" + category + "&productId=" + productId
      )
      console.log("similar products:", result.data)
      setProductList(result.data)
    } catch (error) {
      console.log("SIMILAR PRODUCT ERROR:", error?.response?.data || error)
    }
  }

  return (
    <div>
      <h2 className="font-bold text-3xl mb-5">Similar Product</h2>

      {productList?.length > 0 ? (
        <DisplayProductList productList={productList} />
      ) : (
        <p>No similar products found</p>
      )}
    </div>
  )
}

export default SimilarProduct