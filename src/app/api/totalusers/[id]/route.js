import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function GET(request, { params }) {

    const { id } = params;
    await connectMongoDB();
    const user =await User.findOne({ _id: id });
    return NextResponse.json({user},{status: 200});
}

// สร้าง end point สำหรับ update

export async function PUT(req, { params }) {

    const { id } = params;
    const { newName:name, newEmail:email, newPassword:password } = await req.json();
    const hasedPassword = await bcrypt.hash(password, 10);
    await connectMongoDB();
    await User.findByIdAndUpdate(id, { name, email, password: hasedPassword });
    return NextResponse.json({message:"User updated"},{status: 200});
}