import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Character from "../../../../models/character"; // ปรับ path ตามที่คุณตั้งไว้

export async function GET(req) {
  try {
    await connectMongoDB(); // เชื่อมต่อกับ MongoDB

    const characters = await Character.find(); // ดึงตัวละครทั้งหมด

    return NextResponse.json({ characters }, { status: 200 });
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { message: "Failed to fetch characters" },
      { status: 500 }
    );
  }
}
