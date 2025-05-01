

import { connectMongoDB } from "../../../../../lib/mongodb";
import rooms from "../../../../../models/rooms";

import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectMongoDB();

    const roomId = params.id;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const room = await rooms.findById(roomId);

    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ room }, { status: 200 });
  } catch (error) {
    console.error("GET room error:", error);
    return NextResponse.json({ message: "Failed to fetch room" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectMongoDB();
    const roomId = params.id;
    const updates = await req.json();

    const updatedRoom = await rooms.findByIdAndUpdate(roomId, updates, {
      new: true,
    });

    if (!updatedRoom) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ room: updatedRoom }, { status: 200 });
  } catch (error) {
    console.error("PUT room error:", error);
    return NextResponse.json({ message: "Failed to update room" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectMongoDB();
    const roomId = params.id;

    const deleted = await rooms.findByIdAndDelete(roomId);

    if (!deleted) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Room deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE room error:", error);
    return NextResponse.json({ message: "Failed to delete room" }, { status: 500 });
  }
}
