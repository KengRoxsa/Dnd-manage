"use client";

import React, { useEffect, useState } from "react";

const DynamicBackground = () => {
  const images = [
    "/bg-1.avif",
    "/bg-2.jpg",
    "/bg-3.webp",
    "/bg-4.jpg",
    "/bg-5.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(images[0]);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomImage =
        images[Math.floor(Math.random() * images.length)];
      setCurrentImage(randomImage);
    }, 5000); // เปลี่ยนภาพทุก 5 วิ

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div
      className="fixed inset-0 -z-10 transition-all duration-1000"
      style={{
        backgroundImage: `url(${currentImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 1s ease-in-out",
      }}
    />
  );
};

export default DynamicBackground;
