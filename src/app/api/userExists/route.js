import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";

// Use the same allowed origins as in other routes
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
    await connectMongoDB();
    const { email } = await req.json();
    const user = await User.findOne({ email }).select("_id");
    
    const response = NextResponse.json({ user }, { status: 200 });
    
    // Add CORS headers
    Object.entries(getCORSHeaders(origin)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  } catch (error) {
    console.error("User exists check error:", error);
    
    const response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    
    // Add CORS headers even on error
    Object.entries(getCORSHeaders(origin)).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  }
}