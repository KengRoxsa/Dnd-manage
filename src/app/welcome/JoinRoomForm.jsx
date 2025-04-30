// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function JoinRoomForm() {
//   const [roomName, setRoomName] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await fetch("/api/rooms/join", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ roomName, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to join room");
//       }

//       // Redirect to the room if successful
//       router.push(`/dndroom/${data.room._id}`);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-6 text-center">Join DND Room</h2>
      
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1" htmlFor="roomName">
//             Room Name
//           </label>
//           <input
//             id="roomName"
//             type="text"
//             value={roomName}
//             onChange={(e) => setRoomName(e.target.value)}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-600"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1" htmlFor="password">
//             Password
//           </label>
//           <input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-600"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium 
//                     py-2 px-4 rounded-lg text-lg transition-all duration-300 
//                     transform hover:scale-105 shadow hover:shadow-lg
//                     disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isLoading ? "Joining..." : "Join Room"}
//         </button>
//       </form>
//     </div>
//   );
// }