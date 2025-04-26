"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import Container from "../components/Container";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

function CreateCharacterPage() {
  const { data: session } = useSession();
  if (!session) redirect("/login");

  const userEmail = session.user.email;
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [charClass, setCharClass] = useState("");
  const [background, setBackground] = useState("");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");
  const [str, setStr] = useState(10);
const [dex, setDex] = useState(10);
const [con, setCon] = useState(10);
const [int, setInt] = useState(10);
const [wis, setWis] = useState(10);
const [cha, setCha] = useState(10);


  const router = useRouter();

  // แก้ไข handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !race || !charClass || !session?.user?.id) {
      alert("Please fill in required fields and make sure you're logged in");
      return;
    }
  
    try {
      const characterData = {
        name,
        race,
        classType: charClass,
        background,
        img,
        description,
        createdBy: session.user.id, // ใช้ user.id แทน email
        stats: {
          strength: str,
          dexterity: dex,
          constitution: con,
          intelligence: int,
          wisdom: wis,
          charisma: cha,
        },
      };
  
      console.log("Sending characterData:", characterData);
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(characterData),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create character");
      }
  
      const result = await res.json();
      router.push("/welcome"); // ไปหน้าที่แสดงผลตัวละคร
    } catch (error) {
      console.error("Creation error:", error);
      alert(`Error: ${error.message}`);
    }
  };
  

  return (
    <Container>
      <Navbar session={session} />
      <div className="flex-grow">
        <div className="container mx-auto shadow-xl my-10 p-10 rounded-xl">
          <Link
            href="/welcome"
            className="bg-gray-500 inline-block text-white border py-2 px-3 rounded my-2"
          >
            Go back
          </Link>
          <hr className="my-3" />
          <h3 className="text-xl">Create Character</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              className="w-[300px] block bg-gray-200 border py-2 px-3 rounded text-lg my-2"
              placeholder="Character name"
            />
            <input
              type="text"
              onChange={(e) => setRace(e.target.value)}
              className="w-[300px] block bg-gray-200 border py-2 px-3 rounded text-lg my-2"
              placeholder="Race (e.g., Elf, Human)"
            />
            <input
              type="number"
              onChange={(e) => setStr(Number(e.target.value))}
              placeholder="STR (Strength)"
            />
            <input
              type="number"
              onChange={(e) => setDex(Number(e.target.value))}
              placeholder="DEX (Dexterity)"
            />
            <input
              type="number"
              onChange={(e) => setCon(Number(e.target.value))}
              placeholder="CON (Constitution)"
            />
            <input
              type="number"
              onChange={(e) => setInt(Number(e.target.value))}
              placeholder="INT (Intelligence)"
            />
            <input
              type="number"
              onChange={(e) => setWis(Number(e.target.value))}
              placeholder="WIS (Wisdom)"
            />
            <input
              type="number"
              onChange={(e) => setCha(Number(e.target.value))}
              placeholder="CHA (Charisma)"
            />

            <input
              type="text"
              onChange={(e) => setCharClass(e.target.value)}
              className="w-[300px] block bg-gray-200 border py-2 px-3 rounded text-lg my-2"
              placeholder="Class (e.g., Wizard, Rogue)"
            />
            <input
              type="text"
              onChange={(e) => setBackground(e.target.value)}
              className="w-[300px] block bg-gray-200 border py-2 px-3 rounded text-lg my-2"
              placeholder="Background"
            />
            <input
              type="text"
              onChange={(e) => setImg(e.target.value)}
              className="w-[300px] block bg-gray-200 border py-2 px-3 rounded text-lg my-2"
              placeholder="Image URL"
            />
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              className="w-[300px] block bg-gray-200 border py-2 px-3 rounded text-lg my-2"
              placeholder="Character Description"
              rows="5"
            ></textarea>
            <button
              type="submit"
              className="bg-green-500 text-white border py-2 px-3 rounded text-lg my-2"
            >
              Create Character
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </Container>
  );
}

export default CreateCharacterPage;
