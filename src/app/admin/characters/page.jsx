"use client";
import React, { useState, useEffect } from "react";
import AdminNav from "../components/AdminNav";
import Footer from "../components/Footer";
import SideNav from "../components/SideNav";
import Container from "../components/Container";
import Link from "next/link";
import Image from "next/image";
import DeleteCharacter from "@/app/welcome/DeleteCharacter";

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
      <AdminNav session={session} />
      <div className="flex-grow">
        <div className="container mx-auto">
          <div className="flex mt-10">
            <SideNav />
            <div className="p-10">
              <h3 className="text-3xl mb-3">Manage Characters</h3>
              <p>A list of characters retrieved from the database</p>

              <div className="shadow-lg overflow-x-auto">
                <table className="text-left rounded-md mt-3 table-fixed w-full">
                  <thead>
                    <tr className="bg-gray-400">
                      <th className="p-5">Character ID</th>
                      <th className="p-5">Name</th>
                      <th className="p-5">Image</th>
                      <th className="p-5">Race / Class</th>
                      <th className="p-5">Level</th>
                      <th className="p-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {characters?.map((char) => (
                      <tr key={char._id}>
                        <td className="p-5">{char._id}</td>
                        <td className="p-5">{char.name}</td>
                        <td className="p-5">
                          <Image
                            className="my-3 rounded-md"
                            src={char.img}
                            width={80}
                            height={80}
                            alt={char.name}
                          />
                        </td>
                        <td className="p-5">
                          {char.race} / {char.classType}
                        </td>
                        <td className="p-5">{char.level ?? "N/A"}</td>
                        <td className="p-5">
                          <Link
                            href={`/characters/${char._id}`}
                            className="bg-blue-500 hover:bg-blue-600 text-white border py-2 px-3 rounded-md text-lg"
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
}

export default AdminCharacterManagePage;
