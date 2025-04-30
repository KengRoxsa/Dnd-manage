// import { connectToDB } from "@/lib/mongodb";
// import Room from "@/models/room";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function POST(request) {
//   const { roomName, password } = await request.json();
  
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return new Response(
//         JSON.stringify({ success: false, message: "Unauthorized" }),
//         { status: 401 }
//       );
//     }

//     await connectToDB();

//     // ค้นหาห้องที่ตรงกับชื่อและรหัสผ่าน
//     const room = await Room.findOne({
//       name: roomName,
//       password: password
//     });

//     if (!room) {
//       return new Response(
//         JSON.stringify({ success: false, message: "Invalid room name or password" }),
//         { status: 404 }
//       );
//     }

//     // ตรวจสอบจำนวนผู้เล่นในห้อง
//     if (room.players.length >= room.maxPlayers) {
//       return new Response(
//         JSON.stringify({ success: false, message: "Room is full" }),
//         { status: 400 }
//       );
//     }

//     // ตรวจสอบว่าผู้ใช้อยู่ในห้องแล้วหรือไม่
//     const isAlreadyInRoom = room.players.some(player => 
//       player.toString() === session.user.id
//     );

//     if (!isAlreadyInRoom) {
//       room.players.push(session.user.id);
//       await room.save();
//     }

//     return new Response(
//       JSON.stringify({ 
//         success: true, 
//         room,
//         message: "Joined room successfully" 
//       }),
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Error joining room:", error);
//     return new Response(
//       JSON.stringify({ success: false, message: "Internal server error" }),
//       { status: 500 }
//     );
//   }
// }