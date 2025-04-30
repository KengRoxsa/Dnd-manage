"use client";
import React, { useState, useEffect } from "react";
import AdminNav from "../components/AdminNav";
import Footer from "../components/Footer";
import SideNav from "../components/SideNav";
import Container from "../components/Container";
import Link from "next/link";
import Image from "next/image";
import DeleteBtn from "./DeleteBtn";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import DynamicBackground from "@/app/components/BackgroundSlider";

function AdminUserManagePage() {
  const { data: session } = useSession();
  if (!session) redirect("/login");
  if (!session?.user?.role === "admin") redirect("/welcome");

  const [allPostData, setAllPostData] = useState([]);
  console.log("allPostData wait for delete to complete: ", allPostData);
  const getAllPostData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalposts`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch total posts");
      }

      const data = await res.json();
      setAllPostData(data.totalPosts);
    } catch (error) {
      console.log("Error loading posts : ", error);
    }
  };
  useEffect(() => {
    getAllPostData();
  }, []);

  return (
    <Container>
  {/* Sticky Admin Navbar */}
  <div className="sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur shadow-md">
    <AdminNav session={session} />
  </div>

  {/* Background Animation */}
  <DynamicBackground />

  {/* Main Layout */}
  <main className="flex-grow">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 bg-white bg-opacity-75 backdrop-blur rounded-2xl shadow-lg p-6">

        {/* Side Navigation */}
        <aside className="w-full lg:w-1/4 flex flex-col pt-28">
          <SideNav />
        </aside>

        {/* Content Area */}
        <section className="w-full lg:w-3/4">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">Manage Posts</h3>
          <p className="text-gray-600 mb-6">A list of posts retrieved from the MongoDB database</p>

          <div className="rounded-xl overflow-x-auto shadow border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase">
                <tr>
                  <th className="p-4 w-1/6">Post ID</th>
                  <th className="p-4 w-1/5">Title</th>
                  <th className="p-4 w-1/5">Image</th>
                  <th className="p-4">Content</th>
                  <th className="p-4 w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {allPostData?.map(val => (
                  <tr key={val._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-mono text-xs truncate">{val._id}</td>
                    <td className="p-4 font-medium">{val.title}</td>
                    <td className="p-4">
                      <Image
                        className="rounded-md shadow"
                        src={val.img}
                        width={60}
                        height={60}
                        alt={val.title}
                      />
                    </td>
                    <td className="p-4 max-w-sm truncate text-gray-700">{val.content}</td>
                    <td className="p-4 flex gap-2 ">
                      <Link
                        href={`/admin/posts/edit/${val._id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white border py-2 px-3 rounded-md text-lg my-2"
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
