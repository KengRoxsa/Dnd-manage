"use client";

import React, { useState, useRef } from "react";

export default function MapCanvas() {
  const [mapImage, setMapImage] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [newTokenName, setNewTokenName] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });

  const mapRef = useRef(null);

  const handleMapUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMapImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const createToken = () => {
    if (!newTokenName.trim()) return;
    const newToken = {
      id: Date.now().toString(),
      name: newTokenName,
      x: 50,
      y: 50,
      color: `hsl(${Math.random() * 360}, 70%, 70%)`,
    };
    setTokens([...tokens, newToken]);
    setNewTokenName("");
  };

  const deleteToken = (id) => {
    setTokens(tokens.filter((token) => token.id !== id));
    if (selectedToken === id) {
      setSelectedToken(null);
    }
  };

  const handleMapClick = (e) => {
    if (!selectedToken || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTokens(
      tokens.map((token) =>
        token.id === selectedToken ? { ...token, x, y } : token
      )
    );
  };

  const zoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3));
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5));
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setMapPosition((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const moveMap = (direction) => {
    const step = 20;
    setMapPosition((prev) => {
      switch (direction) {
        case "up":
          return { ...prev, y: prev.y - step };
        case "down":
          return { ...prev, y: prev.y + step };
        case "left":
          return { ...prev, x: prev.x - step };
        case "right":
          return { ...prev, x: prev.x + step };
        default:
          return prev;
      }
    });
  };

  return (
    <div className="map-container w-full p-4 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">🗺️ แผนที่</h2>

      {/* Map Upload */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          อัปโหลดแผนที่:
          <input
            type="file"
            accept="image/*"
            onChange={handleMapUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </label>
      </div>

      <div className="flex gap-4 items-center">
        {/* Map Display */}
        <div
          ref={mapRef}
          className="relative border-2 border-gray-300 rounded-md bg-gray-100"
          style={{ height: "70vh", width: "70vw", overflow: "hidden" }}
          onClick={handleMapClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {mapImage ? (
            <>
              <img
                src={mapImage}
                alt="Map"
                style={{
                  transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${zoom})`,
                  transformOrigin: "top left",
                  transition: "transform 0.05s linear",
                }}
                className="absolute top-0 left-0 object-contain"
              />
              {tokens.map((token) => (
                <div
                  key={token.id}
                  className={`absolute w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                    ${selectedToken === token.id ? "ring-2 ring-yellow-400" : ""}`}
                  style={{
                    left: `${token.x}%`,
                    top: `${token.y}%`,
                    transform: "translate(-50%, -50%)",
                    backgroundColor: token.color,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedToken(token.id);
                  }}
                >
                  <span className="text-xs font-bold text-white truncate w-8 text-center">
                    {token.name}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              ไม่มีแผนที่แสดง
            </div>
          )}
        </div>

        {/* Controls (Zoom & Pan) */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={zoomIn}
              className="bg-gray-600 text-white px-3 py-2 rounded"
            >
              +
            </button>
            <button
              onClick={zoomOut}
              className="bg-gray-600 text-white px-3 py-2 rounded"
            >
              -
            </button>
          </div>
          <div className="flex flex-col items-center gap-2 mt-6">
            <button
              onClick={() => moveMap("up")}
              className="bg-blue-600 text-white px-3 py-2 rounded"
            >
              ↑
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => moveMap("left")}
                className="bg-blue-600 text-white px-3 py-2 rounded"
              >
                ←
              </button>
              <button
                onClick={() => moveMap("right")}
                className="bg-blue-600 text-white px-3 py-2 rounded"
              >
                →
              </button>
            </div>
            <button
              onClick={() => moveMap("down")}
              className="bg-blue-600 text-white px-3 py-2 rounded"
            >
              ↓
            </button>
          </div>
        </div>
      </div>

      {/* Token Management */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">จัดการ Token</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTokenName}
            onChange={(e) => setNewTokenName(e.target.value)}
            placeholder="ชื่อ Token ใหม่"
            className="border rounded p-2 flex-grow"
            onKeyDown={(e) => e.key === "Enter" && createToken()}
          />
          <button
            onClick={createToken}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            สร้าง Token
          </button>
        </div>
        {selectedToken && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => deleteToken(selectedToken)}
              className="bg-red-600 text-white px-3 py-2 rounded"
            >
              ลบ Token ที่เลือก
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
