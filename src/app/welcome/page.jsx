"use client"

import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import Container from '../components/Container'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import DeleteBtn from './DeleteBtn'
import DeleteCharacter from './DeleteCharacter'


function WelcomePage() {
    
  const { data: session } = useSession();
  if (!session) redirect("/login");

  if (session?.user.role === "admin") redirect("/admin");

  const [postData, setPostData] = useState([]);
  const [characterData, setCharacterData] = useState([]); // สำหรับเก็บข้อมูลตัวละคร

  const userEmail = session.user.email;

  // ดึงข้อมูลโพสต์
  const getPost = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts?email=${userEmail}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load posts");

      const data = await res.json();
      setPostData(data.posts);
    } catch (error) {
      console.log("Error loading posts : ", error);
    }
  };

  // ดึงข้อมูลตัวละคร
  // ดึงข้อมูลตัวละคร
  const getCharacters = async () => {
    console.log("session:", session);
    
    if (!session || !session.user || !session.user.id) {  // ใช้ session.user.id แทน session.user._id
      console.error("session not found in session");
      return;
    }
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/characters?createdBy=${session.user.id}`, {
        cache: "no-store",
      });
  
      if (!res.ok) throw new Error("Failed to load characters");
  
      const data = await res.json();
      setCharacterData(data.characters);
  
    } catch (error) {
      console.error("Error loading characters:", error);
    }
  };
  
  
  // ดึงข้อมูลตัวละคร  
  
  
  
  useEffect(() => {
    if (userEmail) {
      getPost();
      getCharacters(); // ดึงข้อมูลตัวละครเมื่อมีอีเมล
    }
  }, [userEmail]);

  return (
    <Container>
      <Navbar session={session} />
      <div className='flex-grow'>
        <div className='container mx-auto shadow-xl my-10 p-10 rounded-xl'>
          <div className='flex justify-between'>
            <div>
              <h3 className='text-3xl'>Profile</h3>
              <p>Welcome, {session?.user?.name} sir</p>
              <p>Email : {session?.user?.email}</p>
            </div>
            <div>
              <Link href="/create" className='bg-green-500 text-white border py-2 px-3 rounded-md text-lg my-2'>Create Post</Link>
            </div>
            <div>
              <Link href="/createCharacter" className='bg-green-500 text-white border py-2 px-3 rounded-md text-lg my-2'>Create Character</Link>
            </div>
          </div>

          {/* User Posts Data */}
          <div>
            {postData && postData.length > 0 ? (
              postData.map(val => (
                <div key={val._id} className='shadow-xl my-10 p-10 rounded-xl'>
                  <h4 className='text-2xl'>{val.title}</h4>
                  <Image 
                    className='my-3 rounded-md' 
                    src={val.img}
                    width={300}
                    height={0}
                    alt={val.title}
                  />
                  <p>{val.content}</p>
                  <div className='mt-5'>
                    <Link className='bg-gray-500 text-white border py-2 px-3 rounded-md text-lg my-2' href={`/edit/${val._id}`}>Edit</Link>
                    <DeleteBtn id={val._id} />
                  </div>
                </div>
              ))
            ) : (
              <p className='bg-gray-300 p-3 my-3'>You have no posts</p>
            )}
          </div>

          {/* User Characters Data */}
          <div>
  {characterData && characterData.length > 0 ? (
    characterData.map(character => (
      <div key={character._id} className='shadow-xl my-10 p-10 rounded-xl'>
        <h4 className='text-2xl'>{character.name}</h4>
        <Image 
          className='my-3 rounded-md' 
          src={character.img}
          width={300}
          height={0}
          alt={character.name}
        />
        <p>{character.description}</p>
        <DeleteCharacter id={character._id} />
      </div>
    ))
  ) : (
    <p className='bg-gray-300 p-3 my-3'>You have no characters</p>
  )}
</div>

        </div>
      </div>
      <Footer />
    </Container>
  );
}

export default WelcomePage;
