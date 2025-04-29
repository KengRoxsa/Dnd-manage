"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminNav from "../components/AdminNav";
import Footer from "../components/Footer";
import SideNav from "../components/SideNav";
import Container from "../components/Container";

export default function AdminRoomsPage() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState([]);

  if (!session) redirect("/login");
  if (session?.user?.role !== "admin") redirect("/welcome");

  // ดึงข้อมูลห้องจาก API เมื่อเพจโหลด
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();
        setRooms(data.rooms); // เก็บข้อมูลห้องใน state
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []); // จะทำงานเมื่อ component ถูก mount เท่านั้น

  return (
    <Container>
      <AdminNav session={session} />
      <div className="flex-grow">
        <div className="container mx-auto">
          <div className="flex mt-10">
            <SideNav />
            <div className="p-10 w-full">
              <h3 className="text-3xl mb-3">Manage Rooms</h3>
              <p>สร้างและจัดการห้องเล่น DND</p>

              <div className="mb-6 mt-4">
                <Link
                  href="/admin/rooms/new"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  + Create Room
                </Link>
              </div>

              <div className="shadow-lg overflow-x-auto">
                <table className="text-left rounded-md mt-3 table-fixed w-full">
                  <thead>
                    <tr className="bg-gray-400">
                      <th className="p-5">Room ID</th>
                      <th className="p-5">Room Name</th>
                      <th className="p-5">Join</th>
                      <th className="p-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* แสดงข้อมูลห้องจาก state */}
                    {rooms.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-5 text-center">
                          No rooms available
                        </td>
                      </tr>
                    ) : (
                      rooms.map((room) => (
                        <tr key={room._id}>
                          <td className="p-5">{room._id}</td>
                          <td className="p-5">{room.name}</td>
                          <td className="p-5">
                            <Link href={`/dndroom/${room._id}`}>
                              <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded">
                                Join
                              </button>
                            </Link>
                          </td>
                          <td className="p-5">
                            <Link
                              href={`/admin/rooms/edit/${room._id}`}
                              className="bg-gray-500 text-white px-3 py-2 rounded mr-2"
                            >
                              Edit
                            </Link>
                            <button className="bg-red-500 text-white px-3 py-2 rounded">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
}
