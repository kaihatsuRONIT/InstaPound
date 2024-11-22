import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { setAuthUser } from '@/redux/authSlice';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const imageRef = useRef();
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender
  })
  const editProfileHandler = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("bio", input.bio);
      formData.append("gender", input.gender);
      if(input.profilePhoto) formData.append("profilePhoto", input.profilePhoto);
      const res = await axios.post("http://localhost:3000/api/v1/user/profile/edit",formData, {
        headers:{
          "Content-Type": "multipart/form-data",
        },
        withCredentials:true
      });
      if(res.data.success){
        const updatedUser = {
          ...user,
          bio: res.data.user?.bio,
          gender: res.data.user?.gender,
          profilePicture: res.data.user?.profilePicture,
        }
        dispatch(setAuthUser(updatedUser));
        toast.success(res.data.message);
        navigate(`/profile/${user?._id}`)
        
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }finally{
      setLoading(false)
    }
  }
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0]
    if (file) setInput({ ...input, profilePhoto: file })
  }
  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value })
  }
  return (
    <div className='flex max-w-2xl mx-auto pl-10'>
      <section className='flex flex-col gap-6 w-full my-8'>
        <h1 className='font-bold text-xl'>Edit Profile</h1>
        <div className='flex items-center justify-between bg-gray-100 rounded p-4'>
          <div className='flex items-center gap-3'>
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="@InstaPound" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-bold text-sm'>{user?.username}</h1>
              <span className='text-gray-600'>{user?.bio || "bio here..."}</span>
            </div>
          </div>
          <input ref={imageRef} onChange={fileChangeHandler} type="file" className='hidden' />
          <Button onClick={() => (imageRef?.current.click())} className="rounded bg-[#0095F6] h-8 hover:bg-blue-500">Change Photo</Button>
        </div>
        <div>
          <h1 className='font-sembold text-xl'>Bio</h1>
          <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} name="bio" className="focus-visible:ring-transparent" />
        </div>
        <div>
          <h1 className='font-sembold text-xl'>Gender</h1>
          <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Gender</SelectLabel>
                <SelectItem onClick value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='flex justify-end'>
          {
            loading ? (
              <>
                <Button className="rounded bg-[#0095F6] h-8 hover:bg-blue-500">
                  <Loader2 className='mr-2 animate-spin h-4 w-4' />
                  please wait
                </Button>
              </>
            ) :
            (<Button onClick={editProfileHandler} className="rounded bg-[#0095F6] h-8 hover:bg-blue-500">Submit</Button>)
          }
        </div>
      </section>
    </div>
  )
}

export default EditProfile