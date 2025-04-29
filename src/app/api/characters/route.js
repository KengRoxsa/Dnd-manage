import { connectMongoDB } from "../../../../lib/mongodb";
import Character from "../../../../models/character";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function DELETE(req) {
  try {
      const id = req.nextUrl.searchParams.get("id");
      await connectMongoDB();
      await Character.findByIdAndDelete(id);
      return NextResponse.json({ message: "Character deleted successfully" }, { status: 200 });
  } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Error deleting character" }, { status: 500 });
  }
}

// API GET สำหรับดึงข้อมูลตัวละคร
export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);

    const createdBy = searchParams.get("createdBy");
    const name = searchParams.get("name");

    let filter = {};

    if (createdBy) {
      filter.createdBy = new mongoose.Types.ObjectId(createdBy);
    }

    if (name) {
      // ใช้ regex สำหรับค้นหาที่ไม่ตรงตัวเป๊ะ เช่น "war" เจอ "Warrior"
      filter.name = { $regex: new RegExp(name, "i") };
    }

    const characters = await Character.find(filter);

    return NextResponse.json({ characters }, { status: 200 });
  } catch (error) {
    console.error("Error fetching characters:", error);
    return NextResponse.json(
      { error: "Failed to fetch characters", details: error.message },
      { status: 500 }
    );
  }
}

  
export async function POST(req) {
  try {
    const {
      name,
      race,
      classType,
      background,
      img,
      description,
      stats,
      createdBy,
      level = 1,
    } = await req.json();

    await connectMongoDB();

    const newCharacter = await Character.create({
      name,
      race,
      classType,
      background,
      img,
      description,
      stats,
      createdBy: new mongoose.Types.ObjectId(createdBy), // ✨ แปลงเป็น ObjectId
      level,
    });

    return NextResponse.json({ message: "Character created", character: newCharacter }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create character", details: error.message }, { status: 500 });
  }
}
// PUT: อัปเดตตัวละคร
export async function PUT(req) {
  try {
    const { id, ...updates } = await req.json();
    await connectMongoDB();

    // อัปเดต character โดย id
    const updatedCharacter = await Character.findByIdAndUpdate(
      id,
      updates,
      { new: true } // คืนค่า document ใหม่หลังอัปเดต
    );

    if (!updatedCharacter) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Character updated successfully", character: updatedCharacter }, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update character", details: error.message }, { status: 500 });
  }
}
