import { connectMongoDB } from "../../../../../lib/mongodb";
import Character from "../../../../../models/character";
import { NextResponse } from "next/server";

// ดึงตัวละครจาก id
export async function GET(req, { params }) {
  const { id } = params;
  await connectMongoDB();
  const character = await Character.findOne({ _id: id });
  return NextResponse.json({ character }, { status: 200 });
}

// อัปเดตตัวละครจาก id
export async function PUT(req, { params }) {
  const { id } = params;
  const { newName:name, newRace:race, newClassType:classType, newLevel:level } = await req.json();
  await connectMongoDB();
  await Character.findByIdAndUpdate(id, { name, race, classType, level });
  return NextResponse.json({ message: "Character updated successfully" }, { status: 200 });
}
