// "use client";
// import { useState, useRef, useEffect } from "react";

// export default function CharacterSearchPage() {
//     const [searchName, setSearchName] = useState("");
//     const [searching, setSearching] = useState(false);
//     const [searchResult, setSearchResult] = useState(null);
//     const [searchResultCharacters, setSearchResultCharacters] = useState([]);
//     const [characters, setCharacters] = useState([]);
//     const [expanded, setExpanded] = useState({});
//     const [mapImage, setMapImage] = useState(null);
//     const [tokens, setTokens] = useState([]);
//     const [newTokenName, setNewTokenName] = useState("");
//     const [selectedToken, setSelectedToken] = useState(null);
//     const [zoom, setZoom] = useState(1); // เพิ่ม state สำหรับซูม
//     const [dragging, setDragging] = useState(false);
//     const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//     const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
//     const mapRef = useRef(null);
//   // Map and Token Functions
//   const handleMapUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setMapImage(event.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const createToken = () => {
//     if (!newTokenName.trim()) return;

//     const newToken = {
//       id: Date.now().toString(),
//       name: newTokenName,
//       x: 50,
//       y: 50,
//       color: `hsl(${Math.random() * 360}, 70%, 70%)`,
//     };

//     setTokens([...tokens, newToken]);
//     setNewTokenName("");
//   };

//   const deleteToken = (id) => {
//     setTokens(tokens.filter((token) => token.id !== id));
//     if (selectedToken === id) {
//       setSelectedToken(null);
//     }
//   };

//   const handleMapClick = (e) => {
//     if (!selectedToken || !mapRef.current) return;

//     const rect = mapRef.current.getBoundingClientRect();
//     const x = ((e.clientX - rect.left) / rect.width) * 100;
//     const y = ((e.clientY - rect.top) / rect.height) * 100;

//     setTokens(
//       tokens.map((token) =>
//         token.id === selectedToken ? { ...token, x, y } : token
//       )
//     );
//   };

// // Zoom and Dragging
// const handleWheel = (e) => {
//     if (e.deltaY < 0) {
//       setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3)); // ซูมเข้า
//     } else {
//       setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // ซูมออก
//     }
//   };

//   const handleMouseDown = (e) => {
//     setDragging(true);
//     setDragStart({ x: e.clientX, y: e.clientY });
//   };

//   const handleMouseMove = (e) => {
//     if (dragging) {
//       const dx = e.clientX - dragStart.x;
//       const dy = e.clientY - dragStart.y;
//       setMapPosition((prev) => ({
//         x: prev.x + dx,
//         y: prev.y + dy,
//       }));
//       setDragStart({ x: e.clientX, y: e.clientY });
//     }
//   };

//   const handleMouseUp = () => {
//     setDragging(false);
//   };

//   // Character Functions (unchanged from your original)
//   const toggleExpand = (id) => {
//     setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const addCharacter = (char) => {
//     if (characters.some((c) => c._id === char._id)) return;
//     setCharacters((prev) => [...prev, char]);
//     setSearchName("");
//     setSearchResult(null);
//     setSearchResultCharacters([]);
//   };

//   const removeCharacter = (id) => {
//     setCharacters((prev) => prev.filter((c) => c._id !== id));
//     setExpanded((prev) => {
//       const newExpanded = { ...prev };
//       delete newExpanded[id];
//       return newExpanded;
//     });
//   };

//   const clearAllCharacters = () => {
//     setCharacters([]);
//     setExpanded({});
//   };

//   const searchPlayer = async () => {
//     if (!searchName.trim()) return;
//     setSearching(true);
//     setSearchResult(null);
//     setSearchResultCharacters([]);

//     try {
//       const res = await fetch(
//         `/api/characters?name=${encodeURIComponent(searchName.trim())}`
//       );
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error || "Search failed");

//       if (data.characters.length === 0) {
//         setSearchResult("not-found");
//       } else {
//         setSearchResult(data.characters.length);
//         setSearchResultCharacters(data.characters);
//       }
//     } catch (err) {
//       console.error("Error searching player:", err);
//       setSearchResult("error");
//     } finally {
//       setSearching(false);
//     }
//   };

//   return (
//     <div className="flex gap-4 p-4 mt-8 justify-between mx-auto">
//       {/* LEFT: Search Panel */}
//       <div className="w-1/6">
//         <h2 className="text-xl font-bold mb-2">🔍 ค้นหาตัวละคร</h2>

//         <div className="flex gap-2 mb-3">
//           <input
//             className="border rounded p-2 flex-grow"
//             type="text"
//             value={searchName}
//             placeholder="ใส่ชื่อตัวละคร..."
//             onChange={(e) => setSearchName(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && searchPlayer()}
//           />
//           <button
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//             onClick={searchPlayer}
//             disabled={searching || !searchName.trim()}
//           >
//             ค้นหา
//           </button>
//         </div>

//         {searching && <p className="text-gray-500">🔄 กำลังค้นหา...</p>}
//         {searchResult === "not-found" && (
//           <p className="text-red-500">❌ ไม่พบตัวละครชื่อนี้</p>
//         )}
//         {typeof searchResult === "number" && (
//           <p className="text-green-600">✅ พบ {searchResult} ตัวละคร</p>
//         )}
//         {searchResult === "error" && (
//           <p className="text-red-600">⚠️ เกิดข้อผิดพลาดระหว่างค้นหา</p>
//         )}

//         {/* Results */}
//         <div className="mt-4 space-y-3">
//           {searchResultCharacters.map((char) => (
//             <div
//               key={char._id}
//               className="border rounded p-3 bg-white shadow flex justify-between items-center"
//             >
//               <div>
//                 <h3 className="font-bold text-lg">{char.name}</h3>
//                 <p className="text-sm text-gray-700">
//                   เผ่า: {char.race} | อาชีพ: {char.classType} | เลเวล:{" "}
//                   {char.level}
//                 </p>
//               </div>
//               <button
//                 className="bg-green-600 text-white px-3 py-1 rounded text-sm"
//                 onClick={() => addCharacter(char)}
//               >
//                 ➕ เพิ่ม
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* MIDDLE: Map Area */}
//       <div className="w-4/6 h-full">
//         <h2 className="text-xl font-bold mb-2">🗺️ แผนที่</h2>

//         <div className="mb-4">
//           <label className="block mb-2 text-sm font-medium">
//             อัปโหลดแผนที่:
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleMapUpload}
//               className="block w-full text-sm text-gray-500
//                 file:mr-4 file:py-2 file:px-4
//                 file:rounded-md file:border-0
//                 file:text-sm file:font-semibold
//                 file:bg-blue-50 file:text-blue-700
//                 hover:file:bg-blue-100"
//             />
//           </label>
//         </div>

//         <div
//           ref={mapRef}
//           className="relative border-2 border-gray-300 rounded-md bg-gray-100"
//           style={{ height: "400px", overflow: "hidden" }}
//           onClick={handleMapClick}
//         >
//           {mapImage ? (
//             <>
//               <img
//                 src={mapImage}
//                 alt="Map"
//                 style={{
//                     transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${zoom})`,
//                     transformOrigin: "top left",
//                     transition: "transform 0.05s linear",
//                   }}
//                 className="w-full h-full object-contain"
//               />
//               {tokens.map((token) => (
//                 <div
//                   key={token.id}
//                   className={`absolute w-10 h-10 rounded-full flex items-center justify-center cursor-move
//                     ${
//                       selectedToken === token.id ? "ring-2 ring-yellow-400" : ""
//                     }`}
//                   style={{
//                     left: `${token.x}%`,
//                     top: `${token.y}%`,
//                     transform: "translate(-50%, -50%)",
//                     backgroundColor: token.color,
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSelectedToken(token.id);
//                   }}
//                 >
//                   <span className="text-xs font-bold text-white truncate w-8 text-center">
//                     {token.name}
//                   </span>
//                 </div>
//               ))}
//             </>
//           ) : (
//             <div className="flex items-center  justify-center h-full text-gray-500">
//               ไม่มีแผนที่แสดง
//             </div>
//           )}
//         </div>

//         <div className="mt-4">
//           <h3 className="font-semibold mb-2">จัดการ Token</h3>
//           <div className="flex gap-2 mb-2">
//             <input
//               type="text"
//               value={newTokenName}
//               onChange={(e) => setNewTokenName(e.target.value)}
//               placeholder="ชื่อ Token ใหม่"
//               className="border rounded p-2 flex-grow"
//               onKeyDown={(e) => e.key === "Enter" && createToken()}
//             />
//             <button
//               onClick={createToken}
//               className="bg-green-600 text-white px-3 py-2 rounded"
//             >
//               สร้าง Token
//             </button>
//           </div>

//           {selectedToken && (
//             <div className="flex gap-2 mt-2">
//               <button
//                 onClick={() => deleteToken(selectedToken)}
//                 className="bg-red-600 text-white px-3 py-2 rounded"
//               >
//                 ลบ Token ที่เลือก
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* RIGHT: Characters Added */}
//       <div className="w-1/6">
//         <h2 className="text-xl font-bold mb-2">📜 ตัวละครที่เลือกไว้</h2>

//         {characters.length === 0 ? (
//           <p className="text-gray-500">ยังไม่มีตัวละครที่เพิ่ม</p>
//         ) : (
//           <>
//             <div className="space-y-3">
//               {characters.map((char) => (
//                 <div
//                   key={char._id}
//                   className="border rounded p-3 bg-white shadow"
//                 >
//                   <div className="flex justify-between items-center">
//                     <h3 className="font-bold text-lg">{char.name}</h3>
//                     <div className="flex gap-2">
//                       <button
//                         className="text-sm text-blue-600 underline"
//                         onClick={() => toggleExpand(char._id)}
//                       >
//                         {expanded[char._id] ? "ซ่อนรายละเอียด" : "แสดงทั้งหมด"}
//                       </button>
//                       <button
//                         className="text-sm text-red-500 underline"
//                         onClick={() => removeCharacter(char._id)}
//                       >
//                         ลบ
//                       </button>
//                     </div>
//                   </div>

//                   <p className="text-sm text-gray-700">
//                     เผ่า: {char.race} | อาชีพ: {char.classType} | เลเวล:{" "}
//                     {char.level}
//                   </p>

//                   {expanded[char._id] && (
//                     <div className="flex flex-col mt-2 text-sm">
//                       {char.img && (
//                         <img
//                           src={char.img}
//                           alt={`${char.name} avatar`}
//                           className="w-24 h-24 object-cover rounded-lg border border-gray-300 mb-2"
//                         />
//                       )}
//                       <p>
//                         <strong>พื้นหลัง:</strong> {char.background}
//                       </p>
//                       <p>
//                         <strong>คำอธิบาย:</strong> {char.description}
//                       </p>
//                       <div>
//                         <strong>Stats:</strong>
//                         <ul className="ml-4 list-disc">
//                           {Object.entries(char.stats).map(([key, value]) => (
//                             <li key={key}>
//                               {key}: {value}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>

//             <button
//               className="mt-4 text-sm text-gray-700 underline"
//               onClick={clearAllCharacters}
//             >
//               🔄 ล้างรายชื่อตัวละครทั้งหมด
//             </button>
//           </>
//         )}

//         {/* Dice Roller */}
//         <div className="mt-8 border-t pt-4">
//           <h2 className="text-lg font-semibold mb-2">🎲 ทอยเต๋า</h2>
//           <DiceRoller />
//         </div>
//       </div>
//     </div>
//   );
// }


