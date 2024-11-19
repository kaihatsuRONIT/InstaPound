import axios from "axios"
import {useEffect} from "react"
import {setPosts} from "@/redux/postSlice"
import { useDispatch } from "react-redux"

const useGetAllPosts = ()=>{
    const dispatch = useDispatch()
    useEffect(()=>{
        const fetchAllPosts = async()=>{
            try {
                const res = await axios.get("http://localhost:3000/api/v1/post/all",{
                    withCredentials:true
                })
                if(res.data.success){
                    dispatch(setPosts(res.data.posts))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllPosts();
    },[]);
}
export default useGetAllPosts;