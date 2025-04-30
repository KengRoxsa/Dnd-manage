"use client";

import React, { useState, useEffect } from "react";
import AdminNav from "@/app/admin/components/AdminNav";
import Footer from "@/app/components/Footer";
import Container from "../../../components/Container";
import Link from "next/link";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { useRouter } from "next/navigation";


function AdminEditUserPage({ params }) {
  const { data: session } = useSession();
  if (!session) redirect("/login");
  if (session?.user?.role !== "admin") redirect("/welcome"); // แก้ไขเงื่อนไขตรวจสอบ role

  const { id } = params;

  const [userOldData, setUserOldData] = useState({
    name: "",
    email: "",
    role: "user" // กำหนดค่าเริ่มต้น
  });

  // สร้าง state สำหรับข้อมูลใหม่
  const [formData, setFormData] = useState({
    newName: "",
    newEmail: "",
    newPassword: "",
    newRole: "user" // เพิ่ม field สำหรับ role
  });

  const router = useRouter();

  const getUserById = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalusers/${id}`, {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await res.json();
      setUserOldData(data.user);
      // ตั้งค่าข้อมูลเริ่มต้นของฟอร์มจากข้อมูลเดิม
      setFormData({
        newName: data.user.name,
        newEmail: data.user.email,
        newPassword: "",
        newRole: data.user.role || "user"
      });
    } catch (error) {
      console.log("Error loading user data:", error);
    }
  };

  useEffect(() => {
    getUserById(id);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalusers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newName: formData.newName,
          newEmail: formData.newEmail,
          newPassword: formData.newPassword,
          newRole: formData.newRole // ส่ง role ใหม่ไปด้วย
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update user");
      }
      router.refresh();
      router.push("/admin/users");
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  return (
    <Container>
      <AdminNav session={session} />
      <div className="flex-grow">
        <div className="container mx-auto shadow-xl my-10 p-10 rounded-xl">
          <Link
            href="/admin/users"
            className="bg-gray-500 inline-block text-white border py-2 px-3 rounded my-2"
          >
            Go back
          </Link>
          <hr className="my-3" />
          <h3 className="text-xl">Admin Edit User Page</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                name="newName"
                className="w-full max-w-md block bg-gray-200 border py-2 px-3 rounded text-lg"
                placeholder={userOldData?.name || "Name"}
                onChange={handleChange}
                value={formData.newName}
              />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="newEmail"
                className="w-full max-w-md block bg-gray-200 border py-2 px-3 rounded text-lg"
                placeholder={userOldData?.email || "Email"}
                onChange={handleChange}
                value={formData.newEmail}
              />
            </div>

            <div>
              <label className="block mb-1">Password (Leave blank to keep current)</label>
              <input
                type="password"
                name="newPassword"
                className="w-full max-w-md block bg-gray-200 border py-2 px-3 rounded text-lg"
                placeholder="New Password"
                onChange={handleChange}
                value={formData.newPassword}
              />
            </div>

            <div>
              <label className="block mb-1">Role</label>
              <select
                name="newRole"
                className="w-full max-w-md block bg-gray-200 border py-2 px-3 rounded text-lg"
                value={formData.newRole}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                {/* เพิ่ม role อื่นๆ ตามต้องการ */}
              </select>
            </div>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white border py-2 px-4 rounded text-lg mt-4"
            >
              Update User
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </Container>
  );
}

export default AdminEditUserPage;
