"use client"

import React, { useState,useEffect } from 'react'
import AdminNav from './components/AdminNav'
import Container from './components/Container'
import Footer from './components/Footer'
import SideNav from './components/SideNav'
import Content from './components/Content'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'


function AdminPage() {

    const { data: session } = useSession();

    if (!session) redirect("/login");
    if (!session?.user?.role === "admin") redirect("/welcome");
//ส่วนการดึง data ( user กับ post ) มาแสดง
    const [totalUsersData, setTotalUsersData] = useState([]);
    const [totalPostsData, setTotalPostsData] = useState([]);

    // สำหรับทดสอบ อย่าลืมมาลบ log นี้ออกนะ
    console.log("Total Users wait for delete to complete: ", totalUsersData);
    console.log("Total Posts wait for delete to complete: ", totalPostsData);

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



    useEffect(()=>{
        getTotalUsers();
        getTotalPosts();
    },[])

  return (
    <Container>
        <AdminNav session={session}/>
            <div className='flex-grow'>
                <div className='container mx-auto'>
                    <div className='flex justify-between mt-10'>
                        <SideNav />
                        <Content totalUsersData={totalUsersData} totalPostsData={totalPostsData}/>
                    </div>
                </div>
            </div>
        <Footer />
    </Container>
  )
}

export default AdminPage