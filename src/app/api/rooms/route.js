import { connectMongoDB } from "../../../../lib/mongodb";
import rooms from "../../../../models/rooms";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { name, maxPlayers, category, password, createBy } = await req.json();
    await connectMongoDB();
    await rooms.create({ name, maxPlayers, category, password, createBy });
    return NextResponse.json({ message: "Room created successfully" }, { status: 201 });
}

export async function GET(req) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    let roomsList;

    if (name) {
      // ถ้ามี query ?name=...
      roomsList = await rooms.find({ name });
    } else {
      // ถ้าไม่มี query name ให้ดึงทั้งหมด
      roomsList = await rooms.find();
    }

    return NextResponse.json({ rooms: roomsList }, { status: 200 });

  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function DELETE(req) {
    const id = req.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await rooms.findByIdAndDelete(id);
    return NextResponse.json({ message: "Room deleted successfully" }, { status: 200 });
}
