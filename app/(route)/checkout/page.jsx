"use client";

import React, { useContext, useState } from "react";
import axios from "axios";
import { CartContext } from "../../_context/CartContext";
import CheckoutProductItem from "../../_components/CheckoutProductItem";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const calculateTotal = () => {
    return (cart || []).reduce((total, item) => {
      return total + Number(item?.price || 0);
    }, 0);
  };

  const total = calculateTotal();

  const saveOrder = async (paymentDetails = null) => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;

      if (!email) {
        toast.error("User email not found");
        return;
      }

      if (!cart || cart.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      setLoading(true);

      const result = await axios.post("/api/order", {
        email,
        orderDetail: cart,
        paymentDetails,
      });

      console.log("Order saved:", result.data);
      toast.success("Order saved successfully");

      if (setCart) setCart([]);

      router.replace("/dashboard");

    } catch (error) {
      console.log("Order save error:", error);
      console.log("Backend error:", error?.response?.data);
      toast.error(error?.response?.data?.error || "Failed to save order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 px-10 md:px-20 lg:px-36">
      <h2 className="font-bold text-3xl">Checkout</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        <div className="flex flex-col gap-3">
          {(cart || []).map((product, index) => (
            <CheckoutProductItem product={product} key={index} />
          ))}
        </div>

        <div>
          <Card className="p-5">
            <h2 className="font-bold text-2xl flex justify-between">
              Total: <span>${total.toFixed(2)}</span>
            </h2>

            <hr className="my-5 border-black" />

            <p>
              Your payment receipt and product will be delivered to your
              registered email ID.
            </p>

            <div className="mt-3 space-y-4">
              <Badge className="bg-yellow-400 text-black px-3 py-1">
                {user?.primaryEmailAddress?.emailAddress || "No email found"}
              </Badge>

              <Button
                onClick={() => saveOrder()}
                disabled={loading || total <= 0}
                className="w-full"
              >
                {loading ? "CREATING ORDER..." : "CREATE ORDER"}
              </Button>

              <div className="mt-10">
                {total > 0 ? (
                  <PayPalButtons
                    style={{ layout: "horizontal" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "USD",
                              value: total.toFixed(2),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const details = await actions.order.capture();
                      await saveOrder(details);
                    }}
                    onCancel={() => toast("Payment cancelled")}
                    onError={(err) => {
                      console.log("PayPal Error:", err);
                      toast.error("Something went wrong with PayPal");
                    }}
                  />
                ) : (
                  <p className="text-sm text-gray-500">Your cart is empty.</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Checkout;