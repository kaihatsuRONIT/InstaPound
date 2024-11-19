import useGetUserProfile from '@/hooks/useGetUserProfile'
import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

function Profile() {
  const {user} = useSelector(store=>store.auth)
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const isLoggedInUser = user?._id == userId ? true : false;
  const { userProfile } = useSelector(store => store.auth);
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
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">Edit profile</Button>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">View Archive</Button>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">Ad Tools</Button>
                  </>
                  ) : (
                    <Button className="bg-[#0095F6] hover:bg-[#3192D2] h-8 text-white">Follow</Button>
                  )
                }
              </div>
            </div>
          </section>
        </div>
      </div>
    </div >
  )
}

export default Profile