import React, { useContext, useState } from 'react'
import { auth } from '../config/firebase'
import { signInWithEmailAndPassword} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
const Login = () => {
  const [val,setVal]=useState({
    email:'',
    password:''
  })
  const [error,setError]=useState('')
  const navigate=useNavigate()
  const {dispatch}=useContext(AuthContext)

  const signIn=(e)=>{
    e.preventDefault()
    try {
      if(!val.email || !val.password) return setError('Fill input form to login')
      signInWithEmailAndPassword(auth,val.email,val.password)
      .then(res=>{
        const user=res.user
        if(user) {
          dispatch({type:'LOGIN',payload:user})
          navigate('/home')
        }
        return setError('Something went wrong!')
      })
      .catch(error=>{
        console.log(error)
      })
    
    } catch (error) {
      console.log(error)
    }
    
    
  }
  
  return (
    <div className='w-2/4 bg-gray-100 shadow-md flex flex-col space-y-4 mx-auto mt-10 pb-10'>
      <span className='text-center font-bold text-2xl my-5'>Quiz App</span>
      <input type="email" name="email" onChange={(e)=>setVal({...val,[e.target.name]:e.target.value})} placeholder='Email address' className='w-2/4 py-2 indent-2 rounded-md mx-auto outline-none'/>
      <input type="password" name='password'onChange={(e)=>setVal({...val,[e.target.name]:e.target.value})} placeholder='password' className='w-2/4 py-2 indent-2 rounded-md mx-auto outline-none'/>
      <button onClick={signIn} className='w-1/4 bg-blue-500 text-white rounded-md mx-auto py-2'>Login</button>
      {
        error &&
        <span className='text-red-500 text-center font-semibold'>*{error}</span>
      }
      
    </div>
  )
}

export default Login