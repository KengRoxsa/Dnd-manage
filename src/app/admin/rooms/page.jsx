"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminNav from "../components/AdminNav";
import Footer from "../components/Footer";
import SideNav from "../components/SideNav";
import Container from "../components/Container";
import DynamicBackground from "@/app/components/BackgroundSlider";

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
      <DynamicBackground />
      <div className="bg-gray-200 opacity-800">
        <AdminNav session={session} />
      </div>
      <div className="flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col mt-20 lg:flex-row mt-10 gap-8 bg-gray-50">
            <aside className="w-full lg:w-1/4 pt-4">
              <div className="mt-8 bg-white rounded-xl shadow-md p-8">
                <SideNav />
              </div>
            </aside>

            <main className="w-full bg-white rounded-xl shadow-md p-8">
              <h3 className="text-3xl font-semibold text-gray-800 mb-2">
                Manage Rooms
              </h3>
              <p className="text-gray-600 mb-6">สร้างและจัดการห้องเล่น DND</p>

              <div className="mb-6">
                <Link
                  href="/admin/rooms/new"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition"
                >
                  + Create Room
                </Link>
              </div>

              <div className="shadow-lg overflow-x-auto rounded-md">
                <table className="w-full text-left table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700 text-sm uppercase">
                      <th className="p-4">Room ID</th>
                      <th className="p-4">Room Name</th>
                      <th className="p-4">Join</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-5 text-center text-gray-500"
                        >
                          No rooms available
                        </td>
                      </tr>
                    ) : (
                      rooms.map((room) => (
                        <tr
                          key={room._id}
                          className="hover:bg-gray-50 border-b"
                        >
                          <td className="p-4 text-sm text-gray-800">
                            {room._id}
                          </td>
                          <td className="p-4 text-sm">{room.name}</td>
                          <td className="p-4">
                            <Link href={`/dndroom/${room._id}`}>
                              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-md text-sm transition">
                                Join
                              </button>
                            </Link>
                          </td>
                          <td className="p-4 flex flex-wrap gap-2">
                            <Link
                              href={`/admin/rooms/edit/${room._id}`}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded-md text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={async () => {
                                const confirmed = confirm(
                                  "คุณแน่ใจหรือไม่ว่าต้องการลบห้องนี้?"
                                );
                                if (!confirmed) return;

                                try {
                                  const res = await fetch(
                                    `/api/rooms/${room._id}`,
                                    {
                                      method: "DELETE",
                                    }
                                  );

                                  if (res.ok) {
                                    alert("ลบห้องเรียบร้อยแล้ว");
                                    // ลบห้องออกจาก state โดยไม่ต้องโหลดใหม่
                                    setRooms((prevRooms) =>
                                      prevRooms.filter(
                                        (r) => r._id !== room._id
                                      )
                                    );
                                  } else {
                                    const errorData = await res.json();
                                    alert(
                                      "เกิดข้อผิดพลาด: " + errorData.message
                                    );
                                  }
                                } catch (err) {
                                  console.error("Error deleting room:", err);
                                  alert("ไม่สามารถลบห้องได้");
                                }
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
}
