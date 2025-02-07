import sendEmail from '../config/sendEmail.js';
import UserModel from './../models/userModel.js';
import bcryptjs from 'bcryptjs';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import { response } from 'express';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js';
import generatedOTP from './../utils/generatedOTP.js';
import ForgotPasswordTemplate from '../utils/ForgotPasswordTemplate.js';
import jwt from 'jsonwebtoken';

//create register new user API
export async function registerUserController(request, response) {
    try {
        const {name, email, password } = request.body

        if(!name || !email || !password){
            return response.status(400).json({
                message : "provide email, name, password",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({email})

        if(user){
            return response.json({
            message : "Already exist Email",
            error : true,
            success : false
            })

        }

        //convert password plain text to hash format(encrypt)
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        //store values in database
        const payload = {
            name,
            email,
            password : hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()  //user save in mongodb db

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

        const verifyEmail = await sendEmail({
            sendTo : email,
            subject : "Verify email from shopSmart",
            html : verifyEmailTemplate({
                name,
                url : VerifyEmailUrl
            })
        })


        return response.json({
            message : "User Register Successfully",
            error : false,
            success : true,
            data : save
        })

        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//Email verify API create
export async function verifyEmailController(){

    try {

        const { code } = request.body
        
        //find a user in the db using the `code` as the `_id`.
        const user = await UserModel.findOne({_id : code})

        if(!user){
            return response.status(500).json({
                message : "Invalid Code",
                error : true,
                success : false
            })
        }

        //if user valid update the fields
        const updateUser = await UserModel.updateOne({_id : code}, {
            verify_email : true
        })

        return response.json({
            message : "Verify Email done",
            success: true,
            error : false
        })
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
        
    }

}

//login controller
export async function loginController(request, response){
      try {
        const {email, password} = request.body //need from client side for login purpose

        if(!email || !password){
            return  response.status(400).json({
                message : "Enter email or password",
                error : true,
                success : false
             })
        }

        //check email is in db or not
        const user = await UserModel.findOne({ email })

        if(!user){
            return  response.status(400).json({
                message : "User not register",
                error : true,
                success : false
             })
        }

        //check email active, inactive or suspended
        if(user.status !== "Active"){
            return  response.status(400).json({
                message : "Contact Admin",
                error : true,
                success : false
             })
        }

        //decrypt password and check password
        const checkPassword = await bcryptjs.compare(password, user.password) 

        if(!checkPassword){
            return  response.status(400).json({
                message : "Check your password",
                error : true,
                success : false
             })
        }

        //for login purpose send token to client side
        //access token - directly use for login purpose  valid for 3/4 hours or 1 day
        // refresh token - increase livespan of access token  valid for 1 week/30days

        const accessToken = await generatedAccessToken(user._id)
        const refreshToken = await generatedRefreshToken(user._id)

        //before send cookies update last login date
        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date() //current date and time
        })

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"  //because backend and frontend in different domains
        }

        //send these toekns to user cookies
        response.cookie('accessToken', accessToken, cookiesOption)
        response.cookie('refreshToken', refreshToken, cookiesOption)

        return  response.status(200).json({
            message : "Login Successfully",
            error : false,
            success : true,
            data : {
                accessToken,
                refreshToken
            }
         }) 


      } catch (error) {
         return  response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
         })
      }
}

//logout controller
export async function logoutController(request, response){
    try {
        const userid = request.userId  //come from middleware
        //remove tokens when logout
        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.clearCookie("accessToken", cookiesOption)
        response.clearCookie("refreshToken", cookiesOption)

        //using id identify users and remove refresh token from db
        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
            refresh_token : ""
        })

        return response.status(200).json({
            message : "Logout Successfully",
            error : false,
            success : true
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//upload user avatar
export async function uploadAvatar(request, response){
    try {
        const userId = request.userId  //auth middleware
        const image = request.file     //multer middleware
        const upload = await uploadImageCloudinary(image)
       // console.log("image", image)

       //save in database
       const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar : upload.url
       })


       return response.json({
        message : "Upload Profile Successfully",
        success : true,
        error : false,
        data : {
            _id : userId,
            avatar : upload.url
        }
    })


        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update user details
export async function updateUserDetails(request, response){
    try {
        const userId = request.userId  //auth middleware
        const {name, email, mobile, password} = request.body
        let hashPassword = ""

        const updateUser = await UserModel.updateOne({ _id : userId},{
            ...(name && {name : name}),
            ...(email && {email : email}),
            ...(mobile && {mobile : mobile}),
            ...(password && {password : hashPassword}),
        })

        return response.json({
            message :"User Updated Successfully",
            error : false,
            success : true,
            data : updateUser
        })
        
    } catch (error) {
        //error handling
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }

}

//forgot password  (not login)
export async function forgotPasswordController(request, response){
    try {
        const {email } = request.body
        //check email is in db or not
        const user = await UserModel.findOne({email})

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            }) 
        }

        //send otp
        const otp = generatedOTP()
        //console.log(otp)
        const expireTime = new Date() + 60 * 60 * 1000 // otp will be expire within 1hr
       
        //this time doesn't send any data to user so u can use findByIdAndUpdate
        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo : email,
            subject : "Forgot Password from shopSmart",
            html: ForgotPasswordTemplate({
                name: user.name,
                otp: otp
    }),

        })

        return response.json({
            message : "check your email ",
            error : false,
            success : true
        }) 
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        }) 
    }
}

//verify forgot password otp
export async function verifyForgotPasswordOTP(request, response){
    try {
        //email need for this otp for which user
       const { email, otp} = request.body

       if(!email || !otp){
        return response.status(400).json({
            message : "Provide required Email or OTP",
            error : true,
            success : false
        }) 
       }

       //check email is in db or not
       const user = await UserModel.findOne({email})

       if(!user){
           return response.status(400).json({
               message : "Email not available",
               error : true,
               success : false
           }) 
       }

       //check otp expire time with current time
       const currentTime = new Date().toISOString()  //it give current time

       if(user.forgot_password_expiry > currentTime){
         return response.status(400).json({
            message : "OTP is expired",
            error : true,
            success : false
         })
       }


       //check client side otp same with my db otp
       if(otp !== user.forgot_password_otp){
        return response.status(400).json({
            message : "Invalid OTP",
            error : true,
            success : false
         })
       }

       //before send response remove forget password otp and expire date from database
       const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
        forgot_password_otp : "",
        forgot_password_expiry : "",

       })


       //if otp not expired and valid otp
       return response.json({
        message : "Verify OTP Successfully",
        error : false,
        success : true
       })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        }) 
    }

}

// reset the password
export async function resetPassword(request, response){
    try {
        const {email, newPassword, confirmNewPassword} = request.body

        if(!email || !newPassword || !confirmNewPassword){
            return response.status(400).json({
                message : "Provide required fields",
                error: true,
                success : false
            })
        }

        const user = await UserModel.findOne({email}) 

        if(!user){
            return response.status(400).json({
                message : "Email is not available",
                error: true,
                success : false
            })
        }

        if(newPassword !== confirmNewPassword ){
            return response.status(400).json({
                message : "New Password and Confirm New Password must be same",
                error: true,
                success : false
            })
        }

        //convert new password to hash format
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword, salt)

       //update previous password to new password
        const update = await UserModel.findOneAndUpdate(user._id, {
            password : hashPassword
        })

        return response.json({
            message: "Password Updated Successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success : false

        })
    }
}


//refresh token controller
export async function refreshToken(request, response){
    try {

        const refreshToken = request.cookies.refreshToken || request?.headers?.
        authorization?.split(" ")[1]  // "[Bearer token]"

        if(!refreshToken){
            return response.status(401).json({
                message : "Invalid Token",
                error : true,
                success : false
            })
        }

        //console.log("refreshToken", refreshToken)

        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return response.status(401).json({
                message : "Token is expired",
                error : true,
                success : false
            })
        }

        console.log("verify token ", verifyToken)

        //if token not expired generate new access token send to the client side
        const userId = verifyToken?.id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"  //because backend and frontend in different domains
        }


        response.cookie("accessToken", newAccessToken, cookiesOption )

        return response.json({
            message : "New Access Token generated",
            error: false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success : false

        })
    }
}

//get login user details
export async function userDetails(request, response){
    try {
        const userId = request.userId  //get user id

        const user = await UserModel.findById(userId).select('-password -refresh_token') //find user by id and remove password and refresh token
        
        return response.json({
            message : 'user details',
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : "Something is wrong",
            error : true,
            success : false
        })
    }
}

