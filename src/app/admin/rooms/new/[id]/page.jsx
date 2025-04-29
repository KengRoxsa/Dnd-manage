'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"
import { redirect } from "next/navigation"
import Container from "../../../components/Container"
import AdminNav from "../../../components/AdminNav"
import SideNav from "../../../components/SideNav"
import Footer from "../../../components/Footer"

export default function EditRoomPage() {
  const { data: session } = useSession()
  const params = useParams()
  const roomId = params.id

  if (!session) redirect("/login")
  if (session?.user?.role !== "admin") redirect("/welcome")

  const [roomData, setRoomData] = useState(null)
  const [loading, setLoading] = useState(true)

  const getRoom = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/rooms/${roomId}`, {
        cache: "no-store",
      })
      const data = await res.json()
      setRoomData(data.room)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching room:", err)
    }
  }

  useEffect(() => {
    getRoom()
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    console.log("Updated Room:", roomData)

    // TODO: เชื่อม PUT /api/rooms/[id]
  }

  if (loading) return <p>Loading...</p>

  return (
    <Container>
      <AdminNav session={session} />
      <div className="flex-grow">
        <div className="container mx-auto">
          <div className="flex mt-10">
            <SideNav />
            <div className="p-10 w-full">
              <h3 className="text-3xl mb-6">Edit Room</h3>

              <form onSubmit={handleUpdate} className="max-w-2xl space-y-6">
                <div>
                  <label className="block font-semibold mb-2">Room Name</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border"
                    value={roomData?.name || ""}
                    onChange={(e) => setRoomData({ ...roomData, name: e.target.value })}
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
                    value={roomData?.maxPlayers || 5}
                    onChange={(e) => setRoomData({ ...roomData, maxPlayers: Number(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Category</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border"
                    value={roomData?.category || ""}
                    onChange={(e) => setRoomData({ ...roomData, category: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Room Password (optional)</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border"
                    value={roomData?.password || ""}
                    onChange={(e) => setRoomData({ ...roomData, password: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
                >
                  Update Room
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
