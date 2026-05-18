import { db } from "@/configs/db";
import { NextResponse } from "next/server";
import { productsTable, usersTable, orderTable } from "@/configs/schema";
import {
  eq,
  desc,
  getTableColumns,
  and,
  ne,
} from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");
    const id = searchParams.get("id");
    const category = searchParams.get("category");
    const productId = searchParams.get("productId");

    // PRODUCT DETAIL PAGE
    if (id) {
      const numericId = Number(id);

      const result = await db
        .select({
          id: productsTable.id,
          title: productsTable.title,
          description: productsTable.description,
          about: productsTable.about,
          bannerUrl: productsTable.bannerUrl,
          category: productsTable.category,
          imageUrl: productsTable.imageUrl,
          price: productsTable.price,
          createdBy: productsTable.createdBy,

          userImage: usersTable.image,
          userName: usersTable.name,
          userEmail: usersTable.email,
        })
        .from(productsTable)
        .innerJoin(
          usersTable,
          eq(productsTable.createdBy, usersTable.email)
        )
        .where(eq(productsTable.id, numericId))
        .limit(1);

      return NextResponse.json(result[0], {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      });
    }

    // SIMILAR PRODUCTS
    if (category) {
      const numericProductId = Number(productId);

      const result = await db
        .select({
          id: productsTable.id,
          title: productsTable.title,
          imageUrl: productsTable.imageUrl,
          price: productsTable.price,
          category: productsTable.category,
        })
        .from(productsTable)
        .where(
          productId
            ? and(
                eq(productsTable.category, category),
                ne(productsTable.id, numericProductId)
              )
            : eq(productsTable.category, category)
        )
        .orderBy(desc(productsTable.id))
        .limit(6);

      return NextResponse.json(result, {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240",
        },
      });
    }

    // USER PRODUCTS
    if (email) {
      const result = await db
        .select({
          id: productsTable.id,
          title: productsTable.title,
          imageUrl: productsTable.imageUrl,
          category: productsTable.category,
          price: productsTable.price,
        })
        .from(productsTable)
        .where(eq(productsTable.createdBy, email))
        .orderBy(desc(productsTable.id));

      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: "Missing required query params" },
      { status: 400 }
    );
  } catch (error) {
    console.log("GET products error", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const limit = Number(body?.limit || 9);

    const result = await db
      .select({
        id: productsTable.id,
        title: productsTable.title,
        imageUrl: productsTable.imageUrl,
        price: productsTable.price,
        category: productsTable.category,

        userImage: usersTable.image,
        userName: usersTable.name,
      })
      .from(productsTable)
      .innerJoin(
        usersTable,
        eq(productsTable.createdBy, usersTable.email)
      )
      .orderBy(desc(productsTable.id))
      .limit(limit);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.log("POST /api/products error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { productId } = await req.json();

    const user = await currentUser();

    await db
      .delete(orderTable)
      .where(eq(orderTable.productId, Number(productId)));

    const result = await db
      .delete(productsTable)
      .where(
        and(
          eq(productsTable.id, Number(productId)),
          eq(
            productsTable.createdBy,
            user?.primaryEmailAddress?.emailAddress
          )
        )
      );

    return NextResponse.json({
      message: "Deleted!",
      result,
    });
  } catch (error) {
    console.log("DELETE product error:", error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}