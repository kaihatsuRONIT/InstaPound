
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import axios from 'axios'
import { toast} from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

function Login() {
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(false)
    const [input, setInput] = useState({
        email: "",
        password: ""
    })
    
    const changeEventHandler = (e)=>{
        setInput({...input,[e.target.name] : e.target.value})
    }
    const navigate = useNavigate()
    const loginHandler = async (e)=>{
        e.preventDefault();
        setLoading(true)
        try {
           const res = await axios.post("http://localhost:3000/api/v1/user/login",input,{
            headers: {
                'Content-Type': "application/json",
            },
            withCredentials: true,
           })
           if(res.data.success){
            dispatch(setAuthUser(res.data.user))
            toast.success(res.data.message)
            setInput({
                email: "",
                password: ""
            })
            navigate("/")
           }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }finally{
            setLoading(false)
        }
    }
    
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
        <form onSubmit={loginHandler} className='shadow-lg flex flex-col gap-5 p-8'>
            <div className='my-4'>
            <h1 className='text-center text-bold text-xl'>LOGO</h1>
            <p>Login to InstaPound</p>
            </div>
            <div>
                <Label className="font-medium">Email</Label>
                <Input
                type="email"
                className="focus-visible:ring-transparent my-2"
                name= "email"
                value={input.email}
                onChange={changeEventHandler}
                />
            </div>
            <div>
                <Label className="font-medium">Password</Label>
                <Input
                type="password"
                className="focus-visible:ring-transparent my-2"
                name= "password"
                value={input.password}
                onChange={changeEventHandler}
                />
            </div>
            {
                loading ? (
                    <Button>
                        <Loader2 className="mr-2 h-4 w-4 animation-spin"/>
                        Please wait
                    </Button>
                ) : (
                    <Button type="submit">Login</Button>
                )
            }
            <span className='text-center' >Don't have an Account? <Link to="/signup" className='text-blue-600'> SignUp</Link></span>
            
        </form>
    </div>
  )
}

export default Login