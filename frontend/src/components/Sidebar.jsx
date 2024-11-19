import { Heart, Home, Icon, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'

function Sidebar() {
    const {user} = useSelector(store=>store.auth)
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const sidebarItems = [
        { Icon: <Home />, text: "Home" },
        { Icon: <Search />, text: "Search" },
        { Icon: <TrendingUp />, text: "Explore" },
        { Icon: <MessageCircle />, text: "Messages" },
        { Icon: <Heart />, text: "Notifications" },
        { Icon: <PlusSquare />, text: "Create" },
        {
            Icon: (
                <Avatar className="w-6 h-6">
                    <AvatarImage src={user?.profilePicture} alt="@InstaPound" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ), text: "Profile"
        },
        { Icon: <LogOut />, text: "Logout" },

    ]
    const logoutHandler = async()=>{
        try {
            const res = await axios.get("/api/v1/user/logout",{withCredentials: true})
            if(res.data.success){
                toast.success(res.data.message)
                dispatch(setAuthUser(null))
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    const createPostHandler = ()=>{
       setOpen(true)
    }
    const sidebarHandler = (navigatingText)=>{
        if(navigatingText == 'Logout'){
            logoutHandler();
        }else if(navigatingText == 'Create'){
            createPostHandler();
        }
        else if(navigatingText == 'Profile'){
            navigate(`/profile/${user?._id}`)
        }
        else if(navigatingText == 'Home'){
            navigate('/')
        }
        else{
            alert(navigatingText)
        }

    }
    return (
        <div className='fixed top-0 left-0 z-10 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col '>
                <h1 className='my-8 pl-4 font-bold text-xl'>LOGO</h1>
                <div>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div onClick={()=> sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-100 rounded-lg cursor-pointer p-3 my-3'>
                                    {item.Icon}
                                    <span>{item.text}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} user={user}/>
        </div>
    )
}

export default Sidebar