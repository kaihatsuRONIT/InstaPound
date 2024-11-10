import express, { urlencoded } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js"
const app = express();
dotenv.config()
//middelwares
app.use(express.json())
app.use(urlencoded({extended:true}))
app.use(cookieParser())
const corsOption = {
    origin : "http://localhost:5173",
    Credentials : true,
}
app.use(cors(corsOption))



app.get('/',(req,res)=>{
    res.send("hello bhaya ji")
})
app.listen(process.env.PORT, ()=>{
    connectDb();
    console.log(`server running on port : ${process.env.PORT}`)
})