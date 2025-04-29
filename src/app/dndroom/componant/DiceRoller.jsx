"use client";
import { useState } from "react";
function DiceRoller() {
    const [selectedDie, setSelectedDie] = useState(20);
    const [result, setResult] = useState(null);
  
    const roll = () => {
      const value = Math.floor(Math.random() * selectedDie) + 1;
      setResult(value);
    };
  
    return (
      <div>
        <div className="flex flex-col items-end justify-center p-4 mr-10 ">
        <h1 className="text-3xl font-bold mb-4">Dice Roller</h1>
        <div className="flex gap-2 mb-2">
          {[6, 10, 20].map((die) => (
            <button
              key={die}
              onClick={() => setSelectedDie(die)}
              className={`px-3 py-1 rounded ${
                selectedDie === die
                  ? "bg-purple-700 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              D{die}
            </button>
          ))}
        </div>
  
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={roll}
        >
          ทอย D{selectedDie}
        </button>
  
        {result !== null && <p className="mt-2 text-xl">🎯 ได้ {result}</p>}
      </div>
        </div>
    );
  }
  
  export default DiceRoller;