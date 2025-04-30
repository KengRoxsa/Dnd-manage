"use client";

import React, { useEffect } from "react";
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
  if (status !== "authenticated" ) {
    return null; // หรือใส่ <Loading /> เพิ่มก็ได้
  }

  return (
    <div>
      <AdminNav session={session} />
      <Container>
        <MapCanvas />
        <CharaSearch />
        <DiceRoller />
      </Container>
      <Footer />
    </div>
  );
}

export default Dndroom;
