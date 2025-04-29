import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    maxPlayers: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
  },
  { timestamps: true } // อันนี้เผื่ออยากได้ createdAt / updatedAt
);

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);
