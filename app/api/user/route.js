import { NextResponse } from "next/server";
import { usersTable } from "../../../configs/schema";
import { db } from "../../../configs/db";          // ✅ IMPORT DB
import { eq } from "drizzle-orm";                  // ✅ IMPORT eq

export async function POST(req) {
  try {
    const { user } = await req.json();

    // Check if user already exists
    const userData = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress));

    // If user does NOT exist
    if (userData.length === 0) {
      const result = await db
        .insert(usersTable)
        .values({
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
          image: user?.imageUrl,
        })
        .returning();

      return NextResponse.json(result[0]);
    }

    // If user already exists
    return NextResponse.json(userData[0]);
  } catch (error) {
    console.error("API /api/user error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
