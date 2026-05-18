import { db } from "@/configs/db";
import { NextResponse } from "next/server";
import { productsTable, usersTable } from "@/configs/schema";
import { desc, eq, like, asc } from "drizzle-orm";

export async function POST(req) {
  try {
    const { limit, offset, searchText, sortBy, sortOrder } = await req.json();
    
    let orderField = productsTable.id;

    if (sortBy === "price") {
      orderField = productsTable.price;
    } else if (sortBy === "id") {
      orderField = productsTable.id;
    }

    const result = await db
      .select({
        id: productsTable.id,
        title: productsTable.title,
        price: productsTable.price,
        description: productsTable.description,
        about: productsTable.about,
        category: productsTable.category,
        imageUrl: productsTable.imageUrl,
        fileUrl: productsTable.fileUrl,
        message: productsTable.message,
        createdBy: productsTable.createdBy,
        user: {
          name: usersTable.name,
          image: usersTable.image,
          email: usersTable.email,
        },
      })
      .from(productsTable)
      .leftJoin(usersTable, eq(productsTable.createdBy, usersTable.email))
      .where(
        searchText ? like(productsTable.title, `%${searchText}%`) : undefined
      )
      .orderBy(sortOrder === "asc" ? asc(orderField) : desc(orderField))
      .limit(Number(limit) || 6)
      .offset(Number(offset) || 0);

    return NextResponse.json(result);
  } catch (error) {
    console.log("ALL PRODUCTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}