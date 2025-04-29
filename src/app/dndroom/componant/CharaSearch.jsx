"use client";
import { useState, useRef } from "react";

export default function CharaSearch() {
  // Character Search States
  const [searchName, setSearchName] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchResultCharacters, setSearchResultCharacters] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [expanded, setExpanded] = useState({});
  
  const mapRef = useRef(null);

  // Character Functions (unchanged from your original)
  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addCharacter = (char) => {
    if (characters.some((c) => c._id === char._id)) return;
    setCharacters((prev) => [...prev, char]);
    setSearchName("");
    setSearchResult(null);
    setSearchResultCharacters([]);
  };

  const removeCharacter = (id) => {
    setCharacters((prev) => prev.filter((c) => c._id !== id));
    setExpanded((prev) => {
      const newExpanded = { ...prev };
      delete newExpanded[id];
      return newExpanded;
    });
  };

  const clearAllCharacters = () => {
    setCharacters([]);
    setExpanded({});
  };

  const searchPlayer = async () => {
    if (!searchName.trim()) return;
    setSearching(true);
    setSearchResult(null);
    setSearchResultCharacters([]);

    try {
      const res = await fetch(
        `/api/characters?name=${encodeURIComponent(searchName.trim())}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Search failed");

      if (data.characters.length === 0) {
        setSearchResult("not-found");
      } else {
        setSearchResult(data.characters.length);
        setSearchResultCharacters(data.characters);
      }
    } catch (err) {
      console.error("Error searching player:", err);
      setSearchResult("error");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="container mx-auto flex justify-between items-start mt-8">
      {/* LEFT: Search Panel */}
      <div className="w-1/6 p-4">
        <h2 className="text-xl font-bold mb-2">🔍 ค้นหาตัวละคร</h2>

        <div className="flex gap-2 mb-3">
          <input
            className="border rounded p-2 flex-grow"
            type="text"
            value={searchName}
            placeholder="ใส่ชื่อตัวละคร..."
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchPlayer()}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={searchPlayer}
            disabled={searching || !searchName.trim()}
          >
            ค้นหา
          </button>
        </div>

        {searching && <p className="text-gray-500">🔄 กำลังค้นหา...</p>}
        {searchResult === "not-found" && (
          <p className="text-red-500">❌ ไม่พบตัวละครชื่อนี้</p>
        )}
        {typeof searchResult === "number" && (
          <p className="text-green-600">✅ พบ {searchResult} ตัวละคร</p>
        )}
        {searchResult === "error" && (
          <p className="text-red-600">⚠️ เกิดข้อผิดพลาดระหว่างค้นหา</p>
        )}

        {/* Results */}
        <div className="mt-4 space-y-3">
          {searchResultCharacters.map((char) => (
            <div
              key={char._id}
              className="border rounded p-3 bg-white shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg">{char.name}</h3>
                <p className="text-sm text-gray-700">
                  เผ่า: {char.race} | อาชีพ: {char.classType} | เลเวล:{" "}
                  {char.level}
                </p>
              </div>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                onClick={() => addCharacter(char)}
              >
                ➕ เพิ่ม
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Characters Added */}
      <div className="w-1/6 p-4">
        <h2 className="text-xl font-bold mb-2">📜 ตัวละครที่เลือกไว้</h2>

        {characters.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีตัวละครที่เพิ่ม</p>
        ) : (
          <>
            <div className="space-y-3">
              {characters.map((char) => (
                <div
                  key={char._id}
                  className="border rounded p-3 bg-white shadow"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">{char.name}</h3>
                    <div className="flex gap-2">
                      <button
                        className="text-sm text-blue-600 underline"
                        onClick={() => toggleExpand(char._id)}
                      >
                        {expanded[char._id] ? "ซ่อนรายละเอียด" : "แสดงทั้งหมด"}
                      </button>
                      <button
                        className="text-sm text-red-500 underline"
                        onClick={() => removeCharacter(char._id)}
                      >
                        ลบ
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700">
                    เผ่า: {char.race} | อาชีพ: {char.classType} | เลเวล:{" "}
                    {char.level}
                  </p>

                  {expanded[char._id] && (
                    <div className="flex flex-col mt-2 text-sm">
                      {char.img && (
                        <img
                          src={char.img}
                          alt={`${char.name} avatar`}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-300 mb-2"
                        />
                      )}
                      <p>
                        <strong>พื้นหลัง:</strong> {char.background}
                      </p>
                      <p>
                        <strong>คำอธิบาย:</strong> {char.description}
                      </p>
                      <div>
                        <strong>Stats:</strong>
                        <ul className="ml-4 list-disc">
                          {Object.entries(char.stats).map(([key, value]) => (
                            <li key={key}>
                              {key}: {value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              className="mt-4 text-sm text-gray-700 underline"
              onClick={clearAllCharacters}
            >
              🔄 ล้างรายชื่อตัวละครทั้งหมด
            </button>
          </>
        )}
      </div>
    </div>
  );
}
