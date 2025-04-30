"use client";
import React, { useState, useEffect } from "react";
import AdminNav from "@/app/admin/components/AdminNav";
import Footer from "@/app/components/Footer";
import Container from "@/app/components/Container";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CharaSearch from "../componant/CharaSearch";
import DiceRoller from "../componant/DiceRoller";
import MapCanvas from "../componant/MapCanvas";

function Dndroom() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isCharaSearchVisible, setCharaSearchVisible] = useState(false); // เพิ่มสถานะ toggle สำหรับ CharaSearch

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);

    if (status === "loading") return;

    if (status === "unauthenticated") {
      console.log("User not authenticated, redirecting to login");
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // ป้องกันการ flash เนื้อหาตอนยังไม่ได้ redirect
  if (status !== "authenticated") {
    return null; // หรือใส่ <Loading /> เพิ่มก็ได้
  }

  return (
    <div>
      <AdminNav session={session} />
      <Container>
        <MapCanvas />

        {/* ปุ่ม toggle สำหรับ CharaSearch */}
<button
  onClick={() => setCharaSearchVisible(!isCharaSearchVisible)}
  className="ml-20 bg-blue-500 text-white text-sm px-3 py-1 rounded mb-2 w-40"
>
  {isCharaSearchVisible ? "ซ่อนการค้นหาตัวละคร" : "แสดงการค้นหาตัวละคร"}
</button>

{/* CharaSearch จะแสดงหรือซ่อนตามสถานะ */}
{isCharaSearchVisible && <CharaSearch />}


        {/* DiceRoller อยู่บนสุดด้วย z-index สูง */}
        <div className="fixed top-15 right-10 z-50">
          <DiceRoller />
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default Dndroom;
