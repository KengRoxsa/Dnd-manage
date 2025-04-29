"use client";
import React from "react";
import AdminNav from "@/app/admin/components/AdminNav";
import Footer from "@/app/components/Footer";
import Container from "@/app/components/Container";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import CharaSearch from "../componant/CharaSearch";
import DiceRoller from "../componant/DiceRoller";
import MapCanvas from "../componant/MapCanvas";
// import CharacterSearchPage from "../componant/DragTokens";

function Dndroom() {
  const { data: session } = useSession();
  const router = useRouter();
  const { status } = useSession();
  if (!session) redirect("/login");
  if (session?.user?.role !== "admin") redirect("/welcome");

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/welcome");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div>Loading...</div>; // หรือใส่ spinner ก็ได้
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
