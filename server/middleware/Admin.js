import UserModel from './../models/userModel.js';

export const Admin = async(request, response, next) => {
   try {
     const userId = request.userId //which come from auth middleware

     const user = await UserModel.findById(userId)

     if(user.role !== "ADMIN"){
        return response.status(400).json({
            message: "Premission denied",
            error : true,
            success : false
        }) 
     }
     //if user admin directly pass to next route
     next()
   } catch (error) {
    return response.status(500).json({
        message: error.message || error,  //only admin user use this
        error : true,
        success : false
    }) 
   }
}