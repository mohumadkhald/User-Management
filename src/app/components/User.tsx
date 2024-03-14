import React from 'react';
import UserInterface from '../interface/user';

const User = ({ user }: { user: UserInterface }) => { // Destructure user directly and provide type annotation
    return (
        <tr key={user.id}>
            <td className='text-gray-600 py-2 px-3 text-center'>{user.id}</td>
            <td className='text-gray-600 py-2 px-3 text-center'>{user.fname} {user.lname}</td>
            <td className='text-gray-600 py-2 px-3 text-center'>{user.email}</td>
            <td className='text-gray-600 py-2 px-3 text-center'>{user.phone}</td>
            <td className='text-gray-600 py-2 px-3 text-center'>{user.address}</td>
            <td className='text-gray-600 py-2 px-3 text-center'>
                <button className="text-green-500 hover:text-green-700 hover:cursor-pointer px-4">Edit</button>
                <a className="text-red-500 hover:text-red-700 hover:cursor-pointer px-1">Delete</a>
            </td>
        </tr>
    )
}

export default User;