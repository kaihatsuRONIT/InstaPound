import express, { urlencoded } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import connectDb from "./config/db.js"
import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";
import messageRoute from "./routes/message.routes.js";

const app = express();
dotenv.config()

//middelwares
app.use(express.json())
app.use(urlencoded({extended:true}))
app.use(cookieParser())
const corsOption = {
    origin : 'http://localhost:5173',
    credentials: true,

}
app.use(cors(corsOption));

//all routes will come here
app.use('/api/v1/user' , userRoute)
app.use('/api/v1/post' , postRoute)
app.use('/api/v1/message' , messageRoute)

app.get('/',(req,res)=>{
    res.send("server is working his ass off")
})
app.listen(process.env.PORT, ()=>{
    connectDb();
    console.log(`server running on port : ${process.env.PORT}`)
}) 