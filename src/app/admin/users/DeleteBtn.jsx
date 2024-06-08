"use client"
import React from 'react'

const DeleteBtn = ({id}) => {
    const handleDelete = async () => {
      const confirmed = confirm("Are you sure you want to delete?");
  
      if (confirmed) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/totalusers?id=${id}`, { // ใช้ query string "id"
        method: "DELETE",
        });
  
        if (res.ok) {
          window.location.reload();
        } else {
          console.log("Failed to delete post");
        }
      }
    };
  
    return (
        <a onClick={handleDelete} className='bg-red-500 text-white border py-2 px-3 rounded-md text-lg my-2' >Delete</a>

    );
  };

export default DeleteBtn

// const res = await fetch(`http://localhost:3000/api/posts?id=${id}`, { // ใช้ query string "id"
//         method: "DELETE",

// const res = await fetch(`http://localhost:3000/api/posts?id/${id}`, {
//         method: "DELETE",

// ตรง = กับ /  การใช้เครื่องหมาย / หรือ ? ใน URL จะมีผลต่อวิธีการส่งข้อมูลไปยังเซิร์ฟเวอร์ในแบบต่าง ๆ 
// โดย เครื่องหมาย / ใช้ในการกำหนด path segments ใน URL:
// & ใช้ในการแยก query parameters ที่แตกต่างกัน เช่น: