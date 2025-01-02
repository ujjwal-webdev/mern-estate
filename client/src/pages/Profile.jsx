import React from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import { useState } from 'react';
import { updateUserStart, updateUserFailure, updateUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function Profile() {

  const dispatch = useDispatch();
  // const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({})
  const [updateSucces, setUpdateSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if(data.success === false)
      {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    }
    catch (error) {
      dispatch(updateUserFailure(error.message));
    } 
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* <input type="file" ref={fileRef} hidden accept='image/*'/> */}
        <img src={currentUser.avatar} alt="Profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <input type="text" placeholder='Username' defaultValue={currentUser.username} onChange={handleChange} className='border p-3 rounded-lg' id='username' />
        <input type="email" placeholder='Email' defaultValue={currentUser.email} onChange={handleChange} className='border p-3 rounded-lg' id='email' />
        <input type="password" placeholder='Password' onChange={handleChange} className='border p-3 rounded-lg' id='password' />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-85'>{loading ? "Loading..." : "Update"}</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ""}</p>
      <p className='text-green-700 mt-5'>{updateSucces ? "User updated successfully!" : ""}</p>
    </div>
  )
}
