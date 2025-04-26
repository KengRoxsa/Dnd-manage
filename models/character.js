import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  race: {
    type: String,
    required: true,
  },
  classType: {
    type: String,
    required: true,
  },
  background: {
    type: String,
    default: "", // ถ้าไม่ได้ส่งมาก็ใส่เป็น "" อัตโนมัติ
  },
  img: {
    type: String,
    default: "/default-image.png", // รูป Default
  },
  description: {
    type: String,
    default: "",
  },
  stats: {
    strength: { type: Number, default: 8 },
    dexterity: { type: Number, default: 8 },
    constitution: { type: Number, default: 8 },
    intelligence: { type: Number, default: 8 },
    wisdom: { type: Number, default: 8 },
    charisma: { type: Number, default: 8 },
  },
  level: {
    type: Number,
    default: 1, // เริ่มเลเวล 1
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
  }
}, { timestamps: true });

const Character = mongoose.models.Character || mongoose.model("Character", characterSchema);

export default Character;
