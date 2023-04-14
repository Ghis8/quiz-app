import React, { useContext, useEffect,useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {AiOutlineUser} from 'react-icons/ai'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { AuthContext } from '../context/AuthContext'
const Nav = ({take_Quiz,create_Quiz}) => {
    const navigate=useNavigate()
    const [user,setUser]=useState(null)
    const [logout,setLogout]=useState(false)
    const {currentUser}=useContext(AuthContext)
    
    useEffect(()=>{
      const User=JSON.parse(localStorage.getItem('user'))
      setUser(User)
    },[])
  return (
    <div className='flex items-center justify-between py-2 px-2 sticky top-0 z-10 shadow-md bg-gray-200'>
        <span className='text-3xl font-semibold cursor-pointer'>Quiz App</span>
        <div className='flex items-center space-x-10'>
            <span onClick={create_Quiz} className={create_Quiz ?'text-blue-500 cursor-pointer':'text-gray-300 cursor-pointer'}>Create quiz</span>
            <span onClick={take_Quiz} className='text-blue-500 cursor-pointer'>Take quiz</span>
            <div onClick={()=>setLogout(true)} className='flex space-x-1 items-center'>
                <span className=''>{user?.email}</span>
                <AiOutlineUser className='text-xl text-blue-600 font-bold'/>
            </div>
        </div>
        {
          logout &&
          <div className='absolute -bottom-28 -z-20 right-2 py-3 px-2 bg-gray-100'>
            <ul className='space-y-3 flex-col flex'>
              <li className='hover:bg-gray-400 px-5'>settings</li>
              <li className='hover:bg-gray-400 px-5'>profile</li>
              <li className='hover:bg-red-500 px-5'><button onClick={()=>{
              signOut(auth)
              navigate('/')
            }}>Logout</button></li>
            </ul>
          </div>
        }
        
    </div>
  )
}

export default Nav