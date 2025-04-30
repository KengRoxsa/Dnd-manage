import React from 'react'
import Link from 'next/link'

function SideNav() {
  return (
    <nav className='shadow-lg p-10 rounded-lg'>
        <ul>
            <li><Link className='block my-3 p-3 rounded-lg hover:bg-gray-200' href="/admin">Dashboard</Link></li>
            <li><Link className='block my-3 p-3 rounded-lg hover:bg-gray-200' href="/admin/users">Users</Link></li>
            <li><Link className='block my-3 p-3 rounded-lg hover:bg-gray-200' href="/admin/posts">Posts</Link></li>
            <li><Link className='block my-3 p-3 rounded-lg hover:bg-gray-200' href="/admin/characters">total Character</Link></li>
            <li><Link className='block my-3 p-3 rounded-lg hover:bg-gray-200' href="/admin/rooms">Room-Play</Link></li>
        </ul>
    </nav>
  )
}

export default SideNav