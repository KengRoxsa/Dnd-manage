"use client";
import Image from "next/image";
import Container from "./components/container";
import Navbar from "./components/Navbar";
import Vercel from "../../public/vercel.svg";
import Footer from "./components/Footer";
import { useSession } from "next-auth/react";

//icons เพิ่มเติม
import { FaFacebook, FaYoutube, FaLinkedin } from "react-icons/fa";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="bg-gray-900 text-white min-h-screen">
      <Container>
        <Navbar session={session} />
        <div className="flex-grow text-center p-10">
          <h3 className="text-5xl">NextJS DashBoard</h3>
          <p>Become full-stack developer with NextJS</p>
          <div className="flex justify-center my-10">
            <Image src={Vercel} width={300} height={0} />
          </div>
        </div>
        <Footer />
      </Container>
      {/* // ส่วนเพิ่มเติม */}
      <div className="fixed bottom-4 left-4 flex flex-col space-y-4">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center space-x-2"
        >
          <div className="bg-blue-1000 p-3 rounded-full group-hover:bg-blue-700 transition-colors">
            <FaFacebook size={24} className="text-white" />
          </div>
          <span className="text-white bg-blue-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
            Facebook
          </span>
        </a>
        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center space-x-2"
        >
          <div className="bg-red-1000 p-3 rounded-full group-hover:bg-red-700 transition-colors">
            <FaYoutube size={24} className="text-white" />
          </div>
          <span className="text-white bg-red-900 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
            YouTube
          </span>
        </a>
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center space-x-2"
        >
          <div className="bg-blue-1000 p-3 rounded-full group-hover:bg-blue-1000 transition-colors">
            <FaLinkedin size={24} className="text-white" />
          </div>
          <span className="text-white bg-blue-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
            LinkedIn
          </span>
        </a>
      </div>
    </main>
  );
}
