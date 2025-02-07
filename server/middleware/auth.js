import jwt from "jsonwebtoken";

//auth middleware
const auth = async (request, response, next) => {
    try {
         //retrieve the access token from cookies or the authorization header.
        const token = request.cookies.accessToken || request?.header?.authorization?.split(" ")[1]  //["Bearer" , "Token"] index 0,1 access only token
        //console.log('token', token)
        //verify token valid or not
        if(!token){
            return response.status(401).json({
                message : "token required",
                error : true,
                success : false
            })
        }
        //decrypt token
        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)

        //if token expired display error
        if(!decode){
            return response.status(401).json({
                message : "unauthorized access",
                error : true,
                success : false
            })
        }

        // console.log("decode", decode)
        request.userId = decode.id
        //send to next route
        next()


    } catch (error) {
        return response.status(500).json({
            message : "Please You have to Login" || error.message || error,
            error : true,
            success : false
        })
    }
}

export default auth