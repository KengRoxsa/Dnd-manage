"use client"; // จำเป็นเพราะใช้ useEffect และ useState

import { useState, useEffect } from "react";
import Image from "next/image";

const DynamicBackground = ({
  images = ["/bg-1.avif", "/bg-2.jpg", "/bg-3.webp", "/bg-4.jpg", "/bg-5.jpg"],
  interval = 6000, // เวลาเปลี่ยนภาพ (มิลลิวินาที)
  fadeDuration = 3000, // เวลา fade (มิลลิวินาที)
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false); // เริ่ม fade-out
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setFade(true); // เริ่ม fade-in
      }, fadeDuration / 2);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, fadeDuration]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="relative w-full h-full">
        {images.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-${fadeDuration} ${
              index === currentIndex && fade ? "opacity-100" : "opacity-0"
            }`}
            style={{
              animation: `zoomIn 10s ease-in-out infinite, moveIn 12s linear infinite`,
            }}
          >
            <Image
              src={img}
              alt={`Background ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0} // โหลดภาพแรกเร็วสุด
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicBackground;
