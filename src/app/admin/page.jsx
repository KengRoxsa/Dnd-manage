"use client"

import React, { useState,useEffect } from 'react'
import AdminNav from './components/AdminNav'
import Container from './components/Container'
import Footer from './components/Footer'
import SideNav from './components/SideNav'
import Content from './components/Content'
import DynamicBackground from '../components/BackgroundSlider'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'


function AdminPage() {

    const { data: session } = useSession();

    if (!session) redirect("/login");
    if (!session?.user?.role === "admin") redirect("/welcome");
//ส่วนการดึง data ( user กับ post ) มาแสดง
    const [totalUsersData, setTotalUsersData] = useState([]);
    const [totalPostsData, setTotalPostsData] = useState([]);
    const [totalCharactersData, setTotalCharactersData] = useState([]);

    // สำหรับทดสอบ อย่าลืมมาลบ log นี้ออกนะ
    console.log("Total Users wait for delete to complete: ", totalUsersData);
    console.log("Total Posts wait for delete to complete: ", totalPostsData);
    console.log("Total Characters wait for delete to complete: ", totalCharactersData);

    // อันแรก เป็นดึง จน. user ทั้งหมด
    const getTotalUsers = async () => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalusers`, {
                cache: "no-store",   
            })
            if(!res.ok){
                throw new Error("Failed to fetch total users");
            }

            const data = await res.json();
            setTotalUsersData(data.totalUsers);


        }catch(error){
            console.log("Error loading users : ", error);
        }
    }
    // อันนี้ของ posts
    const getTotalPosts = async () => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalposts`, {
                cache: "no-store",   
            })
            if(!res.ok){
                throw new Error("Failed to fetch total posts");
            }

            const data = await res.json();
            setTotalPostsData(data.totalPosts);


        }catch(error){
            console.log("Error loading posts : ", error);
        }
    }
    const getTotalCharacters = async () => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalcharacters`, {
                cache: "no-store",   
            })
            if(!res.ok){
                throw new Error("Failed to fetch total characters");
            }

            const data = await res.json();
            setTotalCharactersData(data.totalCharacters);


        }catch(error){
            console.log("Error loading characters : ", error);
        }
    }



    useEffect(()=>{
        getTotalUsers();
        getTotalPosts();
        getTotalCharacters();
    },[])

  return (
    <Container>
  <DynamicBackground />

  {/* Top Navbar */}
  <div className="sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur shadow-md">
    <AdminNav session={session} />
  </div>

  {/* Main Content */}
  <main className="flex-grow">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col mt-20 lg:flex-row gap-8 bg-white bg-opacity-80 backdrop-blur rounded-2xl shadow-lg p-6">
        
        {/* Side Navigation */}
        <aside className="w-full lg:w-1/4">
          <SideNav />
        </aside>

        {/* Main Dashboard Content */}
        <section className="w-full lg:w-3/4">
          <Content
            totalUsersData={totalUsersData}
            totalPostsData={totalPostsData}
          />
        </section>
      </div>
    </div>
  </main>

  <Footer />
</Container>
  )
}

export default AdminPage