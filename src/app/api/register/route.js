import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";
import bcrypt from "bcryptjs"; // Changed to bcryptjs for consistency

const allowedOrigins = [
  "https://dnd-manage-ver01.vercel.app",
  "https://dnd-manage-ver01-frontend.vercel.app",
  "https://dnd-manage-ver01-mwysj9xmi-kengroxsas-projects.vercel.app",
];

function getCORSHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function OPTIONS(req) {
  const origin = req.headers.get("origin") || "";
  return new NextResponse(null, {
    status: 200,
    headers: getCORSHeaders(origin),
  });
}

export async function POST(req) {
  const origin = req.headers.get("origin") || "";

  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    await connectMongoDB();
    await User.create({ name, email, password: hashedPassword });

    const response = NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );

    // Add CORS headers
    Object.entries(getCORSHeaders(origin)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    const response = NextResponse.json(
      { message: "Error occurred while registering" },
      { status: 500 }
    );

    // Add CORS headers even on error
    Object.entries(getCORSHeaders(origin)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }
}