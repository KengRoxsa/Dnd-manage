"use client"
import React from 'react'
const DeleteCharacter = ({ id }) => {
    const handleDelete = async () => {
      const confirmed = confirm("Are you sure you want to delete this character?");
      
      if (confirmed) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/characters?id=${id}`, { // ใช้ query string "id" สำหรับลบตัวละคร
            method: "DELETE",
          });
  
          if (res.ok) {
            window.location.reload(); // รีเฟรชหน้าเมื่อการลบเสร็จสมบูรณ์
          } else {
            console.log("Failed to delete character");
          }
        } catch (error) {
          console.log("Error deleting character:", error);
        }
      }
    };
  
    return (
      <a onClick={handleDelete} className='bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow'>
        Delete
      </a>
    );
  };
  
  export default DeleteCharacter;
  