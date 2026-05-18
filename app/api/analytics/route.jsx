import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { orderTable, productsTable, usersTable } from "@/configs/schema";
import { eq, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {

    const user = await currentUser();

    try {

        const result = await db.select()
            .from(orderTable)
            .innerJoin(productsTable, eq(orderTable.productId, productsTable.id))
            .innerJoin(usersTable, eq(usersTable.email, productsTable.createdBy))
            .where(
                eq(
                    usersTable.email,
                    user?.primaryEmailAddress?.emailAddress
                )
            );

        // Calculate total revenue
        const totalRevenue = result.reduce((sum, item) => {
            return sum + Number(item.products.price);
        }, 0);

        const topProducts = await db
            .select({
                title: productsTable.title,
                imageUrl: productsTable.imageUrl,
                price: productsTable.price,
                totalSales: sql`count(${orderTable.id})`
            })
            .from(orderTable)
            .innerJoin(
                productsTable,
                eq(orderTable.productId, productsTable.id)
            )
            .innerJoin(
                usersTable,
                eq(usersTable.email, productsTable.createdBy)
            )
            .where(
                eq(
                    usersTable.email,
                    user?.primaryEmailAddress?.emailAddress
                )
            )
            .groupBy(
                productsTable.id
            )
            .orderBy(
                desc(sql`count(${orderTable.id})`)
            )
            .limit(5);

        return NextResponse.json({
            orders: result,
            totalOrders: result.length,
            totalRevenue: totalRevenue,
            topProducts: topProducts
        });


    }
    catch (e) {
        console.log(e);

        return NextResponse.json(
            { error: e },
            { status: 500 }
        );
    }
}