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

  const router = useRouter();

  const [name, setName] = useState("Warrior");
  const [race, setRace] = useState("Human");
  const [charClass, setCharClass] = useState("Knight");
  const [background, setBackground] = useState("Adventurer");
  const [img, setImg] = useState("https://assetsio.gnwcdn.com/dungeons-and-dragons-bastions-unearthed-arcana-by-kent-davis.png?width=1200&height=1200&fit=bounds&quality=70&format=jpg&auto=webp");
  const [description, setDescription] = useState("A brave warrior seeking adventure.");

  const [str, setStr] = useState(10);
  const [dex, setDex] = useState(10);
  const [con, setCon] = useState(10);
  const [int, setInt] = useState(10);
  const [wis, setWis] = useState(10);
  const [cha, setCha] = useState(10);


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
        createdBy: session.user.id,
        stats: {
          strength: str,
          dexterity: dex,
          constitution: con,
          intelligence: int,
          wisdom: wis,
          charisma: cha,
        },
      };
      

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(characterData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create character");
      }

      router.push("/welcome");
    } catch (error) {
      console.error("Creation error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Container>
      <Navbar session={session} />
      <main className="flex-grow">
        <div className="max-w-2xl mx-auto shadow-xl my-10 p-10 rounded-xl bg-white">
          <Link
            href="/welcome"
            className="bg-gray-500 text-white py-2 px-4 rounded inline-block mb-4"
          >
            ← Go back
          </Link>
          <h2 className="text-2xl font-bold mb-6">Create New Character</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Basic Info */}
            <div className="space-y-3">
              <label className="block">
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 p-2 border rounded bg-gray-100"
                  placeholder="Character name"
                />
              </label>

              <label className="block">
                Race:
                <input
                  type="text"
                  value={race}
                  onChange={(e) => setRace(e.target.value)}
                  className="w-full mt-1 p-2 border rounded bg-gray-100"
                  placeholder="e.g., Elf, Human"
                />
              </label>

              <label className="block">
                Class:
                <input
                  type="text"
                  value={charClass}
                  onChange={(e) => setCharClass(e.target.value)}
                  className="w-full mt-1 p-2 border rounded bg-gray-100"
                  placeholder="e.g., Wizard, Rogue"
                />
              </label>

              <label className="block">
                Background:
                <input
                  type="text"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="w-full mt-1 p-2 border rounded bg-gray-100"
                  placeholder="Character background"
                />
              </label>

              <label className="block">
                Image URL:
                <input
                  type="text"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                  className="w-full mt-1 p-2 border rounded bg-gray-100"
                  placeholder="Character image URL"
                />
              </label>
            </div>

            {/* Stats */}
            <fieldset className="border rounded p-4 mt-4">
              <legend className="text-lg font-semibold mb-2">Stats</legend>
              <div className="grid grid-cols-2 gap-4">
                <label>STR:
                  <input type="number" value={str} onChange={(e) => setStr(Number(e.target.value))} className="w-full mt-1 p-2 border rounded" />
                </label>
                <label>DEX:
                  <input type="number" value={dex} onChange={(e) => setDex(Number(e.target.value))} className="w-full mt-1 p-2 border rounded" />
                </label>
                <label>CON:
                  <input type="number" value={con} onChange={(e) => setCon(Number(e.target.value))} className="w-full mt-1 p-2 border rounded" />
                </label>
                <label>INT:
                  <input type="number" value={int} onChange={(e) => setInt(Number(e.target.value))} className="w-full mt-1 p-2 border rounded" />
                </label>
                <label>WIS:
                  <input type="number" value={wis} onChange={(e) => setWis(Number(e.target.value))} className="w-full mt-1 p-2 border rounded" />
                </label>
                <label>CHA:
                  <input type="number" value={cha} onChange={(e) => setCha(Number(e.target.value))} className="w-full mt-1 p-2 border rounded" />
                </label>
              </div>
            </fieldset>

            {/* Description */}
            <label className="block mt-4">
              Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full mt-1 p-2 border rounded bg-gray-100"
                placeholder="Character background story..."
              ></textarea>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-lg"
            >
              Create Character
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </Container>
  );
}

export default CreateCharacterPage;
