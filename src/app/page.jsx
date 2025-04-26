"use client";
import Image from "next/image";
import Container from "./components/Container";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useSession } from "next-auth/react";
import { FaFacebook, FaYoutube, FaLinkedin, FaDiceD20 } from "react-icons/fa";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen">
      <Container>
        <Navbar session={session} />
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="mb-8 p-4 bg-gray-800 rounded-full shadow-lg">
            <FaDiceD20 className="text-4xl text-purple-400 animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Post and DnD Dashboard
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mb-10">
            Become a full-stack developer with NextJS while managing your DnD adventures
          </p>
          
        </section>

        {/* Social Links - Floating */}
        <div className="fixed bottom-6 left-6 flex flex-col space-y-4 z-10">
          {[
            { 
              icon: <FaFacebook size={20} />, 
              href: "https://www.facebook.com", 
              bg: "bg-blue-600",
              hoverBg: "bg-blue-700",
              name: "Facebook"
            },
            { 
              icon: <FaYoutube size={20} />, 
              href: "https://www.youtube.com", 
              bg: "bg-red-600",
              hoverBg: "bg-red-700",
              name: "YouTube"
            },
            { 
              icon: <FaLinkedin size={20} />, 
              href: "https://www.linkedin.com", 
              bg: "bg-blue-500",
              hoverBg: "bg-blue-600",
              name: "LinkedIn"
            }
          ].map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 transition-all duration-300"
            >
              <div className={`${social.bg} p-3 rounded-full group-hover:${social.hoverBg} transition-colors shadow-md`}>
                {social.icon}
              </div>
              <span className={`text-sm font-medium ${social.bg} px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0`}>
                {social.name}
              </span>
            </a>
          ))}
        </div>

      </Container>
        <Footer />
    </main>
  );
}