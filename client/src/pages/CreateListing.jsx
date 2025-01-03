import React from 'react'
import { useState } from 'react'
import { getStorage } from 'firebase/storage';
import { app } from '../firebase';
import { ref, uploadBytesResumable } from 'firebase/storage';

export default function CreateListing() {

    const [files, setfiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleImageSubmit = (e) => {
        if(files.length > 0 && files.length + formData.imageUrls.length < 7)
        {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for(let i = 0; i < files.length; i++)
            {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
                setImageUploadError(false);
                setUploading(false);
            }).catch((error) => {
                setImageUploadError('Image upload failed (2mb max per image)');
                setUploading(false);
            })
        }
        else
        {
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    }

    const storeImage = async (file) => {
        return new Promise(async (resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                }
                ,(error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                }
            )
        })
        })
    }

    const handleRemoveImage = (index) => {
        const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
        setFormData({...formData, imageUrls: newImageUrls});

    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className="flex flex-col gap-4 flex-1">
                    <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required/>
                    <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required/>
                    <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required/>
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input className='w-5' type="checkbox" name="" id="sale" />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input className='w-5' type="checkbox" name="" id="rent" />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input className='w-5' type="checkbox" name="" id="parking" />
                            <span>Parking Spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input className='w-5' type="checkbox" name="" id="furnished" />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input className='w-5' type="checkbox" name="" id="offer" />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg'/>
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id='bathrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg'/>
                            <p>Baths</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id='regularPrice' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg'/>
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id='discountPrice' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg'/>
                            <div className="flex flex-col items-center">
                                <p>Discounted Price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-4 flex-1'>
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                    </p>
                    <div className="flex gap-4">
                        <input onChange={(e) => setfiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" name="" id="images" accept='images/*' multiple />
                        <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80' disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
                    </div>
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => {
                            <div key={url} className="flex justify-between items-center gap-4 p-3 border border-gray-300 rounded-lg">
                                <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                                <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                            </div>
                        }
                    )}
                    <button type='button' onClick={handleImageSubmit} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
                </div>
            </form>
        </main>
    )
}
