import jwt from "jsonwebtoken"
export const authenticated = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "unauthorized",
                success: false
            })
        }
        const decode = await jwt.verify(token , process.env.JWT_SECRET)
        if(!decode){
            return res.status(401).json({
                message: "Invalid authorization",
                success: false
            })
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error)
    }

}