import useGetUserProfile from '@/hooks/useGetUserProfile'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { ChartArea, Heart, MessageCircle } from 'lucide-react';

function Profile() {
  const { user } = useSelector(store => store.auth)
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");
  const isLoggedInUser = user?._id == userId ? true : false;
  const isFollowing = true;
  const { userProfile } = useSelector(store => store.auth);
  const changeTabHandler = (tab)=>{
    setActiveTab(tab)
  }
  const displayPostOrBookmarked = activeTab =="posts" ? userProfile?.posts : userProfile?.bookmarks
  return (
    <div className='flex max-w-5xl mx-auto justify-center pl-10'>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt="@InstaPound" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-2'>
                <span>{userProfile?.username}</span>
                {
                  isLoggedInUser ? (
                    <>
                      <Link to="/account/edit"><Button variant="secondary" className="hover:bg-gray-200 h-8">Edit profile</Button></Link>
                      <Button variant="secondary" className="hover:bg-gray-200 h-8">View Archive</Button>
                      <Button variant="secondary" className="hover:bg-gray-200 h-8">Ad Tools</Button>
                    </>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button variant="secondary" className="h-8 hover:bg-gray-200">Unfollow</Button>
                        <Button variant="secondary" className="h-8 hover:bg-gray-200">message</Button>
                      </>

                    ) : (
                      <Button className="bg-[#0095F6] hover:bg-[#3192D2] h-8 text-white">Follow</Button>
                    )

                  )
                }
              </div>
              <div className='flex items-center gap-5'>
                <p><span className='font-semibold'>{userProfile?.posts.length} </span>posts</p>
                <p><span className='font-semibold'>{userProfile?.followers.length} </span>followers</p>
                <p><span className='font-semibold'>{userProfile?.following.length} </span>following</p>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{userProfile?.bio || "bio here..."}</span>
                <span>carpe diem</span>
                <span>set time t is 0</span>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab == 'posts' ? 'font-bold' : ''}`} onClick={()=> changeTabHandler("posts")}>
              POSTS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab == 'saved' ? 'font-bold' : ''}`} onClick={()=> changeTabHandler("saved")}>
              SAVED
            </span>

          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              displayPostOrBookmarked.map((post)=>{
                return(
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post?.image} alt="@InstaPound" className='rounded my-2 w-full object-cover aspect-square' />
                    <div className='absolute rounded inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transtion-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <button className="flex items-center hover:text-gray-300">
                          <Heart/>
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className="flex items-center hover:text-gray-300">
                          <MessageCircle/>
                          <span>{post?.comments.length}</span>
                        </button>

                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div >
  )
}

export default Profile