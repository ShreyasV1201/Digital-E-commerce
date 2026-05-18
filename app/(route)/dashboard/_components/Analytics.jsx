"use client"

import axios from "axios"
import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function Analytics() {

    const [orderList, setOrderList] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [topProducts, setTopProducts] = useState([]);
    const revenueMap = {};

    orderList.forEach((item) => {

        const title = item.products.title;

        if (revenueMap[title]) {
            revenueMap[title] += item.products.price;
        } else {
            revenueMap[title] = item.products.price;
        }

    });

    const chartData = Object.keys(revenueMap).map((key) => ({
        name: key,
        revenue: revenueMap[key]
    }));

    useEffect(() => {
        GetData();
    }, [])

    const GetData = async () => {

        try {

            const result = await axios.get('/api/analytics');

            console.log(result.data);

            setOrderList(result.data.orders);
            setTotalOrders(result.data.totalOrders);
            setTotalRevenue(result.data.totalRevenue);
            setTopProducts(result.data.topProducts);

        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="mt-5 px-4 md:px-6">

            <h2 className="font-bold text-3xl mt-5">
                Analytics
            </h2>

            {/* Stats Cards */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-7">

                <div className="bg-yellow-200 border rounded-xl p-4">

                    <h2 className="text-lg font-medium">
                        Total Orders
                    </h2>

                    <h2 className="text-3xl font-bold mt-2">
                        {totalOrders}
                    </h2>

                </div>

                <div className="bg-green-200 border rounded-xl p-5">

                    <h2 className="text-lg font-medium">
                        Total Revenue
                    </h2>

                    <h2 className="text-4xl font-bold mt-2">
                        ${totalRevenue}
                    </h2>

                </div>

            </div>

            <div className="mt-10 bg-white border rounded-2xl p-6 shadow-sm">

                <h2 className="font-bold text-2xl mb-5">
                    Revenue Overview
                </h2>

                <ResponsiveContainer width="100%" height={220}>

                    <BarChart data={chartData}>

                        <XAxis dataKey="name" />

                        <YAxis />

                        <Tooltip />

                        <Bar dataKey="revenue" radius={[10, 10, 0, 0]} />

                    </BarChart>

                </ResponsiveContainer>

            </div>

            {/* Recent Orders */}

            <div className="mt-10">

                <h2 className="font-bold text-2xl mb-5">
                    Recent Orders
                </h2>

                <div className="flex flex-col gap-5">

                    {orderList.map((item, index) => (

                        <div
                            key={index}
                            className="flex justify-between items-center border rounded-xl p-4"
                        >

                            <div className="flex items-center gap-5">

                                <img
                                    src={item.products.imageUrl}
                                    alt="product"
                                    className="w-20 h-20 rounded-xl object-cover"
                                />

                                <div>

                                    <h2 className="font-bold text-lg">
                                        {item.products.title}
                                    </h2>

                                    <h2 className="text-gray-500">
                                        {item.products.category}
                                    </h2>

                                    <h2 className="text-sm text-gray-400 mt-1">
                                        Buyer: {item.orders.email}
                                    </h2>

                                </div>

                            </div>

                            <h2 className="font-bold text-2xl">
                                ${item.products.price}
                            </h2>

                        </div>

                    ))}

                </div>

            </div>

            <div className="mt-12">

                <h2 className="font-bold text-2xl mb-5">
                    Top Selling Products
                </h2>

                <div className="flex flex-col gap-4">

                    {topProducts.map((item, index) => (

                        <div
                            key={index}
                            className="flex justify-between items-center border rounded-xl p-4"
                        >

                            <div className="flex items-center gap-4">

                                <img
                                    src={item.imageUrl}
                                    alt="product"
                                    className="w-16 h-16 rounded-lg object-cover"
                                />

                                <div>

                                    <h2 className="font-bold">
                                        {item.title}
                                    </h2>

                                    <h2 className="text-gray-500">
                                        ${item.price}
                                    </h2>

                                </div>

                            </div>

                            <div>

                                <h2 className="font-bold text-xl">
                                    {item.totalSales}
                                </h2>

                                <h2 className="text-gray-500 text-sm">
                                    Sales
                                </h2>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    )
}

export default Analytics