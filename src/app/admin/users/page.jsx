"use client";

import React, { useState, useEffect } from "react";
import AdminNav from "../components/AdminNav";
import Footer from "../components/Footer";
import SideNav from "../components/SideNav";
import Container from "../components/Container";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import DeleteBtn from "./DeleteBtn";
import DynamicBackground from "@/app/components/BackgroundSlider";

function AdminUserManagePage() {
  const { data: session } = useSession();
  if (!session) redirect("/login");
  if (!session?.user?.role === "admin") redirect("/welcome");

  const [allUsersData, setAllUsersData] = useState([]);


  // รอลบหลังเทส
  console.log("allUsersData : ", allUsersData);



  const getAllUsersData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalusers`, {});
      if (!res.ok) {
        throw new Error("Failed to fetch total users", error);
      }

      const data = await res.json();
      setAllUsersData(data.totalUsers);
    } catch (error) {
      console.log("Error loading users : ", error);
    }
  };
  useEffect(() => {
    getAllUsersData();
  }, []);

  return (
    <Container>
  <DynamicBackground />

  {/* Top Navbar */}
  <div className="sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur shadow-md">
    <AdminNav session={session} />
  </div>

  {/* Main Content */}
  <main className="flex-grow">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 bg-white bg-opacity-80 backdrop-blur rounded-2xl shadow-lg p-6">

        {/* Side Navigation */}
        <aside className="w-full lg:w-1/4">
          <SideNav />
        </aside>

        {/* Main Section */}
        <section className="w-full lg:w-3/4">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">Manage Users</h3>
          <p className="text-gray-600 mb-6">A list of users retrieved from the MongoDB database</p>

          <div className="rounded-xl overflow-x-auto shadow-lg border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase">
                <tr>
                  <th className="p-4 w-1/6">ID</th>
                  <th className="p-4 w-1/6">Username</th>
                  <th className="p-4 w-1/6">Email</th>
                  <th className="p-4 w-1/6">Role</th>
                  <th className="p-4 w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {allUsersData?.map((val) => (
                  <tr key={val._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 truncate font-mono text-xs">{val._id}</td>
                    <td className="p-4 font-medium text-gray-900">{val.name}</td>
                    <td className="p-4">{val.email}</td>
                    <td className="p-4 capitalize">{val.role}</td>
                    <td className="p-4 flex gap-2">
                      <Link
                        href={`/admin/users/edit/${val._id}`}
                        className="bg-purple-500 hover:bg-purple-600 text-white border py-2 px-3 rounded-md text-lg my-2"
                      >
                        Edit
                      </Link>
                      <DeleteBtn id={val._id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </main>

  <Footer />
</Container>

  );
}

export default AdminUserManagePage;
