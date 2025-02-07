import { Router } from 'express';
import { forgotPasswordController, loginController, logoutController, refreshToken, registerUserController, resetPassword, updateUserDetails, uploadAvatar, userDetails, verifyEmailController, verifyForgotPasswordOTP } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const userRouter = Router()

userRouter.post('/register', registerUserController)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/login', loginController)
//get used because does not accept any data from client side
userRouter.get('/logout', auth, logoutController)
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar)
userRouter.put('/update-user', auth, updateUserDetails)
// no need auth because user no need to login reset password
userRouter.put('/forgot-password', forgotPasswordController)
userRouter.put('/verify-forgot-password-otp', verifyForgotPasswordOTP)
userRouter.put('/reset-password', resetPassword)
userRouter.post('/refresh-token', refreshToken)
// need auth because only login user will be able to access
userRouter.get('/user-details',auth, userDetails)

export default userRouter;