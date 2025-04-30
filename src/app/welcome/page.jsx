"use client"

import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import Container from '../components/Container'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DeleteBtn from './DeleteBtn'
import DeleteCharacter from './DeleteCharacter'
import BackgroundSlider from '../components/BackgroundSlider'

function WelcomePage() {
  const { data: session } = useSession();
  const router = useRouter(); // ใช้ router ในการ redirect
  const [postData, setPostData] = useState([]);
  const [characterData, setCharacterData] = useState([]);
  const userEmail = session?.user?.email;

  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundRoom, setFoundRoom] = useState(null);

  useEffect(() => {
    if (session === undefined) return; // กรณีที่ session ยังไม่ถูกโหลด
    if (!session) {
      router.push("/login"); // ถ้าไม่มี session ให้ redirect ไปที่ /login
      return;
    }

    if (session?.user.role === "admin") {
      router.push("/admin"); // ถ้าเป็น admin ให้ redirect ไปที่ /admin
      return;
    }

    // ดึงข้อมูล posts และ characters ถ้ามี session
    if (userEmail) {
      getPost();
      getCharacters();
    }
  }, [session, userEmail, router]);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/rooms?name=${roomName}`);
      const data = await res.json();

      const room = data.rooms.find(room => room.password === roomPassword);

      if (room) {
        setFoundRoom(room);  
        setRoomName('');
        setRoomPassword('');
      } else {
        setErrorMessage("Room not found or incorrect password");
      }
    } catch (error) {
      setErrorMessage("An error occurred while searching for the room.");
    } finally {
      setLoading(false);
    }
  };

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

  const getCharacters = async () => {
    if (!session || !session.user || !session.user.id) {
      console.error("session not found");
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

  return (
    <Container>
      <BackgroundSlider />
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 opacity-80"
      >

      <Navbar session={session} />
      </div>

      <div className='flex-grow'>
        <div className='container mx-auto shadow-xl my-10 p-10 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50'>
          <div className='flex justify-between p-6 rounded-lg shadow-md flex-col'>
            <div className='text-indigo-900 bg-indigo-100 p-4 rounded-lg mb-4'>
              <h3 className='text-3xl font-bold mb-4'>Profile</h3>
              <p className='m-4 text-lg'>
                Welcome, <span className='font-semibold text-indigo-700'>{session?.user?.name}</span> sir
              </p>
              <p className='m-4 text-lg'>
                <span className='font-medium'>Email :</span>
                <span className='text-indigo-600 ml-2'>{session?.user?.email}</span>
              </p>
            </div>

            <div className='space-y-4'>
            <div className="flex flex-col space-y-2">
  <Link
    href="/create"
    className="w-[180px] bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow hover:shadow-lg"
  >
    Create Post
  </Link>

  <Link
    href="/createCharacter"
    className="w-[180px] bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow hover:shadow-lg"
  >
    Create Character
  </Link>
</div>


              <div className="bg-red-100 p-4 rounded-lg shadow">
                <form onSubmit={handleJoinRoom} className="flex flex-col space-y-3">
                  <label className="text-red-700 font-semibold">Join DND Room</label>
                  <input
                    type="text"
                    placeholder="Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="p-2 rounded border"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    className="p-2 rounded border"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className='bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-101 shadow hover:shadow-lg disabled:opacity-50'
                  >
                    {loading ? "Joining..." : "Join Room"}
                  </button>
                  
                  {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </form>
                
              </div>

              {foundRoom && (
  <div className="bg-green-100 p-4 rounded-lg shadow space-y-3">
    <h4 className="text-green-800 font-semibold text-xl">Room Found!</h4>
    <p><span className="font-medium">Room Name:</span> {foundRoom.name}</p>
    <p><span className="font-medium">Created By:</span> {foundRoom.createBy || "No description provided"}</p>
    <p><span className="font-medium">Room ID:</span> {foundRoom._id || "No description provided"}</p>

    <Link href={`/dndroom/${foundRoom._id}`} >
    
      <button className='mt-3 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow hover:shadow-lg'>
        Go to Room
      </button>
    </Link>
    
  </div>
  
)}

            </div>
          </div>

          <h3 className='text-3xl mt-10'>Your Posts</h3>
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

          <div>
            <h3 className='text-3xl mt-10'>Your Characters</h3>
            <div className='mt-5 mb-5 grid grid-cols-2 gap-6'>
              {characterData && characterData.length > 0 ? (
                characterData.map(character => (
                  <div key={character._id} className='shadow-xl p-6 rounded-xl flex flex-col items-center'>
                    <h4 className='text-2xl'>{character.name}</h4>
                    {character.img && character.img.startsWith('http') ? (
                      <Image
                        className='my-3 rounded-full'
                        src={character.img}
                        width={250}
                        height={250}
                        alt={character.name}
                        onError={(e) => { e.target.src = ''; }}
                      />
                    ) : (
                      <p>No picture</p>
                    )}
                    <p>{character.description}</p>
                    <div className="flex gap-2 mt-4">
                      <Link href={`/characters/${character._id}`} className='bg-blue-500 hover:bg-blue-600 text-white border py-2 px-3 rounded-md text-lg'>
                        Edit
                      </Link>
                      <DeleteCharacter id={character._id} />
                    </div>
                  </div>
                ))
              ) : (
                <p className='bg-gray-300 p-3 my-3'>You have no characters</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </Container>
  );
}

export default WelcomePage;
