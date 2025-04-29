// หน้าสำหรับ ดูรายละเอียด + แก้ไขข้อมูลตัวละคร
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditCharacterPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCharacter() {
      const res = await fetch(`/api/characters/${id}`);
      const data = await res.json();
      setCharacter(data.character);
      setLoading(false);
    }
    fetchCharacter();
  }, [id]);

  

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("stats.")) {
      const statName = name.split(".")[1];
      setCharacter(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [statName]: value,
        }
      }));
    } else {
      setCharacter({ ...character, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/characters`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...character }),
    });

    if (res.ok) {
        alert("Character updated successfully");
      router.push("/welcome"); // หรือกลับไปหน้าลิสต์ตัวละคร
    } else {
      console.error("Failed to update character");
    }
  };

  if (loading) return <p className="text-center p-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Character</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          value={character.name || ""}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 rounded"
        />
        <input
          name="race"
          value={character.race || ""}
          onChange={handleChange}
          placeholder="Race"
          className="border p-2 rounded"
        />
        <input
          name="classType"
          value={character.classType || ""}
          onChange={handleChange}
          placeholder="Class"
          className="border p-2 rounded"
        />
        <input
          name="background"
          value={character.background || ""}
          onChange={handleChange}
          placeholder="Background"
          className="border p-2 rounded"
        />
        <input
          name="img"
          value={character.img || ""}
          onChange={handleChange}
          placeholder="Image URL"
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          value={character.description || ""}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="level"
          value={character.level || 1}
          onChange={handleChange}
          placeholder="Level"
          className="border p-2 rounded"
        />

        <div>
          <h2 className="text-xl font-semibold mt-4 mb-2">Stats</h2>
          {character.stats && Object.entries(character.stats).map(([key, val]) => (
            <input
              key={key}
              name={`stats.${key}`}
              value={val}
              onChange={handleChange}
              placeholder={key}
              className="border p-2 rounded mb-2 w-full"
            />
          ))}
        </div>

        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
