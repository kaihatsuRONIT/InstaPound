import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

function SuggestedUsers() {
  const { SuggestedUsers } = useSelector(store => store.auth);
  return (
    <div className='my-10'>
      <div className='flex items-center text-sm gap-8'>
        <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
        <span className='font-medium cursor-pointer'>See all</span>
      </div>
      {
        SuggestedUsers.map((user) => {
          return (
            <div key={user?._id} className='flex items-center gap-8' >
              <div className='flex items-center gap-2 mt-7'>
                <Link to={`/profile/${user?._id}`}>
                  <Avatar>
                    <AvatarImage src={user?.profilePicture} alt="@InstaPound" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                  <span className='font-normal text-gray-600 text-sm'>{user?.bio || "bio here..."}</span>
                </div>
              </div>
              <span className='text-[#3BADF8] cursor-pointer text-xs font-bold hover:text-blue-500'>Follow</span>

            </div>
          )

        })
      }
    </div>
  )
}

export default SuggestedUsers