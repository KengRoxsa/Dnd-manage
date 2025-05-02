
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import bcrypt from "bcrypt";

export async function OPTIONS(req) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://dnd-manage-ver01-frontend.vercel.app", // ปรับเป็น domain ที่ต้องการ
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
export async function POST(req) {
    try {
        const {name, email, password} = await req.json();

        const hashedPassword = await bcrypt.hash(password, 10);

        await connectMongoDB();
        await User.create({ name, email, password: hashedPassword });

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
}
catch(error){
return NextResponse.json({ message: "Error accur while registering" }, { status: 500 });
}
}
