"use client";
import React, { useState, useEffect } from "react";
import AdminNav from "../components/AdminNav";
import Footer from "../components/Footer";
import SideNav from "../components/SideNav";
import Container from "../components/Container";
import Link from "next/link";
import Image from "next/image";
import DeleteCharacter from "@/app/welcome/DeleteCharacter";
import DynamicBackground from "@/app/components/BackgroundSlider";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

function AdminCharacterManagePage() {
  const { data: session } = useSession();

  if (!session) redirect("/login");
  if (session?.user?.role !== "admin") redirect("/welcome");

  const [characters, setCharacters] = useState([]);

  const fetchCharacters = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/totalcharacters`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch characters");

      const data = await res.json();
      setCharacters(data.characters);
    } catch (err) {
      console.error("Error loading characters:", err);
    }
  };

  useEffect(() => {
    fetchCharacters();
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
        <aside className="w-full lg:w-1/4 lg:border-r border-gray-200 mt-20 ">
          <SideNav />
        </aside>

        {/* Content Section */}
        <section className="w-full lg:w-3/4">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">Manage Characters</h3>
          <p className="text-gray-600 mb-6">A list of characters retrieved from the database</p>

          <div className="rounded-xl overflow-x-auto shadow-lg border border-gray-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase">
                <tr>
                  <th className="p-4">Character ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Image</th>
                  <th className="p-4">Race / Class</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {characters?.map((char) => (
                  <tr key={char._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-mono text-xs">{char._id}</td>
                    <td className="p-4 font-medium text-gray-900">{char.name}</td>
                    <td className="p-4">
                      <Image
                        className="rounded-md border border-gray-300"
                        src={char.img}
                        width={80}
                        height={80}
                        alt={char.name}
                      />
                    </td>
                    <td className="p-4">{char.race} / {char.classType}</td>
                    <td className="p-4">{char.level ?? "N/A"}</td>
                    <td className="p-4 flex gap-2">
                      <Link
                        href={`/characters/${char._id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow"
                      >
                        Edit
                      </Link>
                      <DeleteCharacter id={char._id} />
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

export default AdminCharacterManagePage;
