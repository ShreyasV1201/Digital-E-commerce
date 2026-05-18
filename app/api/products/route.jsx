import { db } from "@/configs/db";
import { NextResponse } from "next/server";
import { productsTable, usersTable,orderTable } from "@/configs/schema";
import { eq, desc, getTableColumns, and, ne } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const id = searchParams.get("id");
    const category = searchParams.get("category");
    const productId = searchParams.get("productId");

    if (id) {
      const result = await db
        .select({
          ...getTableColumns(productsTable),
          userImage: usersTable.image,
          userName: usersTable.name,
          userEmail: usersTable.email,
        })
        .from(productsTable)
        .innerJoin(usersTable, eq(productsTable.createdBy, usersTable.email))
        .where(eq(productsTable.id, Number(id)));

      return NextResponse.json(result[0]);
    }

    if (category) {
      const result = await db
        .select()
        .from(productsTable)
        .where(
          productId
            ? and(
              eq(productsTable.category, category),
              ne(productsTable.id, Number(productId))
            )
            : eq(productsTable.category, category)
        )
        .orderBy(desc(productsTable.id));

      return NextResponse.json(result);
    }

    if (email) {
      const result = await db
        .select()
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
    const { limit } = await req.json();

    const result = await db
      .select({
        ...getTableColumns(productsTable),
        userImage: usersTable.image,
        userName: usersTable.name,
        userEmail: usersTable.email,
      })
      .from(productsTable)
      .innerJoin(
        usersTable,
        eq(productsTable.createdBy, usersTable.email)
      )
      .orderBy(desc(productsTable.id))
      .limit(Number(limit));

    return NextResponse.json(result);
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

    // delete related orders first
    await db
      .delete(orderTable)
      .where(eq(orderTable.productId, Number(productId)));

    // then delete product
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