import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const generatedRefreshToken = async(userId) => {
    const token = await jwt.sign({id:userId},
         process.env.SECRET_KEY_REFRESH_TOKEN, {expiresIn : '7d'}
        )


    //every time generate new refresh token update in db
    const updateRefreshTokenUser = await UserModel.updateOne(
        { _id : userId},
        {
            refresh_token : token
        }
    )

    return token
}

export default generatedRefreshToken