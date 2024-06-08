"use client";
import React from 'react';
import Link from 'next/link';
import Logo from '../../../public/next.svg';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

function Navbar({session}) {
  //ตรงนี้รับ prop มาเช็คว่ามีการ login หรือไม่
  return (
    <nav className="shadow-xl">
      <div className="container mx-auto">
        <div className="flex justify-between items-center p-4">
          <div>
            <Link href="/">
              <Image src={Logo} width={100} height={100} alt="NextJS Logo" />
            </Link>
          </div>
          <ul className='flex'>
            {!session ? (
              <>
              <li className='mx-3'><Link href="/login">Log in</Link></li>
              <li className='mx-3'><Link href="/register">Register</Link></li>
              
              </>
            ) : (
              <li className='mx-3'>
                {/* ปุ่มที่ให้ไปหน้าแรกได้โดย log in ค้างไว้อยู่ */}
              <Link href="/welcome" className='bg-gray-500 text-white border p-2 px-3 rounded-md text-lg my-2'>Profile</Link>
              <a onClick={() => signOut()} className='bg-red-500 text-white border p-2 px-3 rounded-md text-lg my-2'>Logout</a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
