"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserListing from "./_components/UserListing";
import PurchaseHistory from "./_components/PurchaseHistory";
import Analytics from "./_components/Analytics";

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // read initial from URL or fallback to 'listing'
  const initial = searchParams?.get("tab") || "listing";
  const [tab, setTab] = useState(initial);

  // keep local state in sync if URL changes externally (back/forward)
  useEffect(() => {
    const current = searchParams?.get("tab") || "listing";
    setTab(current);
  }, [searchParams]);

  const onTabChange = (value) => {
    setTab(value);

    // preserve any other query params
    const params = new URLSearchParams(Array.from(searchParams?.entries() || []));
    params.set("tab", value);

    // replace so history doesn't spam entries (use push if you want back-button behavior)
    router.replace(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-16">
      <h2 className="font-bold text-2xl">Dashboard</h2>

      <Tabs value={tab} onValueChange={onTabChange} className="mt-5">
        <TabsList>
          <TabsTrigger value="listing">Listing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="purchase">Purchase</TabsTrigger>
        </TabsList>

        <TabsContent value="listing">
          <UserListing />
        </TabsContent>
        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
        <TabsContent value="purchase">
          <PurchaseHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}