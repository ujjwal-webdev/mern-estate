import React from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import { useState } from 'react';
import { updateUserStart, updateUserFailure, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutStart, signOutFailure, signOutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {

  const dispatch = useDispatch();
  // const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({})
  const [updateSucces, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

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

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false)
      {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    }
    catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try{
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();

      if(data.success === false)
      {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    }
    catch (error) {
      dispatch(signOutFailure(error.message));
    }
  }

  const handleShowListings = async () => {
    try
    {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if(data.success === false)
      {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
      setShowListingsError(false);
    }
    catch (error) {
      setShowListingsError(true);
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
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ""}</p>
      <p className='text-green-700 mt-5'>{updateSucces ? "User updated successfully!" : ""}</p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
      <p>{showListingsError ? 'Error showing listings...' : ''}</p>
      <div className="flex flex-col gap-4 mt-5">
        <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
        {userListings && userListings.length > 0 && userListings.map((listing) => (
          <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
            <Link to={`/listing/${listing._id}`} className='text-slate-700'>
              <img src={listing.imageUrls[0]} alt="Listing Cover" className='h-16 w-16 object-contain rounded-lg' />
            </Link>
            <Link to={`/listing/${listing._id}`} className='text-slate-700 font-semibold flex-1 hover:underline truncate'>{listing.name}</Link>
            <div className='flex flex-col items-center gap-2'>
              <button className='text-red-700 uppercase'>Delete</button>
              <button className='text-green-700 uppercase'>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
