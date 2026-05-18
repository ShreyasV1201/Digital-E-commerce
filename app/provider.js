"use client";

import { useEffect, useState } from "react";
import Header from "./_components/Header";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { CartContext } from "./_context/CartContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function Provider({ children }) {
  console.log("ENV CLIENT ID:", process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
  const { user } = useUser();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user) {
      CheckIsNewUser();
      GetCartItems();
    }
  }, [user]);

  const CheckIsNewUser = async () => {
    await axios.post("/api/user", {
      user: user,
    });
  };

  const GetCartItems = async () => {
    try {
      const result = await axios.get(
        "/api/cart?email=" + user?.primaryEmailAddress?.emailAddress,
      );
      setCart(result.data);
    } catch (error) {
      console.log("Get cart items error:", error?.response?.data || error);
    }
  };
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    console.error("PayPal Client ID is missing!");
  }

  console.log("PAYPAL CLIENT ID:", clientId);
  return (
    <CartContext.Provider value={{ cart, setCart }}>
      <PayPalScriptProvider
        options={{
          "client-id": clientId,
          currency: "USD",
          intent: "capture",
          components: "buttons",
        }}
        key={clientId} // 👈 IMPORTANT FIX
      >
        <Header />
        {children}
      </PayPalScriptProvider>
    </CartContext.Provider>
  );
}

export default Provider;
