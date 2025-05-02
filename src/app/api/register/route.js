
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
    const origin = req.headers.get("origin") || "";
  
    try {
      const { name, email, password } = await req.json();
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await connectMongoDB();
      await User.create({ name, email, password: hashedPassword });
  
      const res = NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  
      // ✅ เพิ่ม CORS headers ตรงนี้
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.headers.set("Access-Control-Allow-Credentials", "true");
  
      return res;
    } catch (error) {
      const res = NextResponse.json({ message: "Error occurred while registering" }, { status: 500 });
  
      // ✅ เผื่อ CORS แม้ error
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.headers.set("Access-Control-Allow-Credentials", "true");
  
      return res;
    }
  }
  
