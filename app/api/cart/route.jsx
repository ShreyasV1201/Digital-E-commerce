import { db } from "@/configs/db";
import { cartTable, productsTable } from "@/configs/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { email, productId } = await req.json();

    const inserted = await db
      .insert(cartTable)
      .values({
        email,
        productId,
      })
      .returning();

    const result = await db
      .select({
        cartId: cartTable.id,
        productId: productsTable.id,
        title: productsTable.title,
        price: productsTable.price,
        imageUrl: productsTable.imageUrl,
        category: productsTable.category,
      })
      .from(cartTable)
      .innerJoin(productsTable, eq(cartTable.productId, productsTable.id))
      .where(eq(cartTable.id, inserted[0].id));

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        cartId: cartTable.id,
        productId: productsTable.id,
        title: productsTable.title,
        price: productsTable.price,
        imageUrl: productsTable.imageUrl,
        category: productsTable.category,
      })
      .from(cartTable)
      .innerJoin(productsTable, eq(cartTable.productId, productsTable.id))
      .where(eq(cartTable.email, email));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get cart items error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const recordId = searchParams.get("recordId");

    if (!recordId || isNaN(Number(recordId))) {
      return NextResponse.json(
        { error: "Invalid recordId" },
        { status: 400 }
      );
    }

    await db.delete(cartTable).where(eq(cartTable.id, Number(recordId)));

    return NextResponse.json({ resp: "Deleted!!!" });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return NextResponse.json(
      { error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}