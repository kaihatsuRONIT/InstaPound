import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';
import { toast } from 'sonner';

function CreatePost({ open, setOpen, user }) {
  const [file,setFile] = useState("")
  const [caption,setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState('');
  const [loading,setLoading] = useState(false)
  const dispatch = useDispatch();
  const {posts} = useSelector(store=>store.post)
  const fileChangeHandler = async(e)=>{
    const file = e.target.files?.[0]
    if(file){
      setFile(file)
      const dataUri = await readFileAsDataURL(file);
      setImagePreview(dataUri)
    }
  }
  const createPostHandler = async(e)=>{
    const formData = new FormData;
    formData.append("caption", caption)
    if(imagePreview) formData.append('image', file)
    try {
     setLoading(true)
      const res = await axios.post('http://localhost:3000/api/v1/post/addPost',formData,{
        headers:{
          'Content-Type': "multipart/form-data"
        },
        withCredentials:true
      });
      if(res.data.success){
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }finally{
      setLoading(false)
    }
  }
  const imageRef = useRef();
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => (
        setOpen(false),
        setImagePreview("")
      )}>
        <DialogHeader className="text-bold items-center font-medium text-xl">Create New Post</DialogHeader>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='text-gray-600 text-xs'>{user?.bio}</span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="foucs-visible:ring-transparent border-none" placeholder="write a caption" />
        {
          imagePreview && (
            <div>
              <img src={imagePreview} alt="@InstaPound" className='w-full h-full rounded object-cover' />
            </div>
          )
        }
        <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler}/>
        <Button onClick={()=> imageRef.current.click()} className="w-96 mx-auto bg-blue-500 hover:bg-blue-700 rounded ">Select from device</Button>
        {
          imagePreview && (
            loading ? (
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                please wait
              </Button>
            ):(
              <Button onClick={createPostHandler} type='submit' className="w-96 mx-auto bg-blue-500 hover:bg-blue-700 rounded ">
              Post
            </Button>
            )
          )
        }
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost