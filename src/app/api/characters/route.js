import { connectMongoDB } from "../../../../lib/mongodb";
import Character from "../../../../models/character";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


// API GET สำหรับดึงข้อมูลตัวละคร
export async function GET(req) {
    try {
      await connectMongoDB();
      const { searchParams } = new URL(req.url);
      const createdBy = searchParams.get("createdBy");
  
      if (!createdBy) {
        return NextResponse.json({ error: "CreatedBy is required" }, { status: 400 });
      }
  
      // ตรวจสอบให้ `createdBy` เป็น ObjectId
      const characters = await Character.find({ createdBy: new mongoose.Types.ObjectId(createdBy) });
      return NextResponse.json({ characters }, { status: 200 });
    } catch (error) {
      console.error("Error fetching characters:", error);
      return NextResponse.json({ error: "Failed to fetch characters", details: error.message }, { status: 500 });
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

  