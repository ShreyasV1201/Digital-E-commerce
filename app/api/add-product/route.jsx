import { NextResponse } from "next/server";
import { storage } from "@/configs/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "@/configs/db";
import { productsTable } from "@/configs/schema";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const image = formData.get("image");
    const file = formData.get("file");
    const data = JSON.parse(formData.get("data") || "{}");

    console.log("DATA RECEIVED:", data);

    if (!image) {
      return NextResponse.json({ error: "Image missing" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "File missing" }, { status: 400 });
    }

    if (!data?.userEmail) {
      return NextResponse.json({ error: "User email missing" }, { status: 400 });
    }

    const imageRef = ref(storage, `digital-store/images/${Date.now()}-${image.name}`);
    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    const fileRef = ref(storage, `digital-store/files/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);

    const result = await db
      .insert(productsTable)
      .values({
        title: data.title,
        price: Number(data.price),
        description: data.description,
        about: data.about,
        category: data.category,
        imageUrl: imageUrl,
        fileUrl: fileUrl,
        message: data.message,
        createdBy: data.userEmail,
      })
      .returning();

    return NextResponse.json(result);
  } catch (error) {
    console.log("POST /api/add-product error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}