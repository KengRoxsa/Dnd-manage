'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation" // ใช้ useRouter สำหรับการนำทาง
import Container from "../../components/Container"
import AdminNav from "../../components/AdminNav"
import SideNav from "../../components/SideNav"
import Footer from "../../components/Footer"

export default function CreateRoomPage() {
  const { data: session } = useSession()
  const router = useRouter()  // ใช้ useRouter สำหรับการนำทาง
  console.log("Session Data test:", session)

  useEffect(() => {
    if (!session) {
      router.push("/login") // ใช้ router.push แทน redirect
    } else if (session?.user?.role !== "admin") {
      router.push("/welcome") // ใช้ router.push แทน redirect
    }
  }, [session, router]) // ใช้ session และ router เป็น dependencies ของ useEffect

  const [name, setName] = useState("")
  const [maxPlayers, setMaxPlayers] = useState(5)
  const [category, setCategory] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit session:", session);
    if (!session || !session?.user?.id) {
      console.error("User session is invalid.");
      return;
    }

    const payload = { 
      name, 
      maxPlayers, 
      category, 
      password, 
      createBy: session.user.id // ต้องแน่ใจว่า _id มีค่า
    };

    console.log("Create Room Payload:", payload);

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        console.log("Room created successfully!");
        router.push("/admin/rooms");  // ใช้ router.push แทน redirect
      } else {
        console.error("Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <Container>
      <AdminNav session={session} />
      <div className="flex-grow">
        <div className="container mx-auto">
          <div className="flex mt-10">
            <SideNav />
            <div className="p-10 w-full">
              <h3 className="text-3xl mb-6">Create New Room</h3>

              <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div>
                  <label className="block font-semibold mb-2">Room Name</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Max Players</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="w-full p-3 rounded-lg border"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Category</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Room Password (optional)</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600"
                >
                  Create Room
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  )
}
