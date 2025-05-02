import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";

// CORS handler สำหรับ preflight requests (OPTIONS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // หรือใส่ origin ที่ต้องการอนุญาตแบบเฉพาะเจาะจง
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req) {
  try {
    await connectMongoDB();
    const { email } = await req.json();
    const user = await User.findOne({ email }).select("_id");
    console.log("User:", user);

    return new NextResponse(JSON.stringify({ user }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // หรือ origin จริงของ frontend
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
