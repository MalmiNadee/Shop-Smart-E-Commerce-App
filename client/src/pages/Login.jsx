import { useState } from "react"
import {FaRegEyeSlash} from "react-icons/fa6";
import {FaRegEye} from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

const Login = () => {
    const [data, setData] = useState({
        email : "",
        password : "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const {name, value} = e.target

        setData((preve) => {
            return {
                ...preve, //restore previous value
                [name]  : value 
            }
        })
    }
    // console.log("data",data)
    const validateValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
         e.preventDefault()  //stop the refresh page 

       try {
           const response = await Axios({
            ...SummaryAPI .login,
            data : data
           })

           if(response.data.error){
              toast.error(response.data.message)
           }

           if(response.data.success){
              toast.success(response.data.message)
              //access token and refresh token to store in local storage
              localStorage.setItem('accessToken', response.data.data.accessToken)
              localStorage.setItem('refreshToken', response.data.data.refreshToken)

              //call fetch user details
              const userDetails = await fetchUserDetails()
              dispatch(setUserDetails(userDetails.data))


              //reset the fields and user direct to Home page
              setData({
                 email : "",
                 password : "",
              })
              navigate("/")
           }

           // console.log("response", response)
       } catch (error) {
           AxiosToastError(error)
       }

        

    }
   
  return (
    <section className="w-full container mx-auto px-2">
        <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
            <p className="font-bold text-lg mb-2">Login</p>

            <form className="grid gap-4 py-6" onSubmit={handleSubmit}>
      
                <div className="grid gap-1">
                    <label htmlFor="email">Email : </label>
                    <input type="email" id="email" name="email" className="bg-blue-50 p-2 border rounded outline-none focus:border-secondary-200" 
                    value={data.email} onChange={handleChange} placeholder="Enter Your Email"/>
                </div>
                <div className="grid gap-1">
                   <label htmlFor="password">Password : </label>
                   <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-secondary-200">
                      <input type={showPassword ? "text" : "password"}
                      id="password" name="password" className="w-full outline-none" value={data.password} onChange={handleChange}
                      placeholder="Enter Your Password"
                      />
                      <div onClick={() => setShowPassword(preve => !preve)} className="cursor-pointer"> 
                      { showPassword ? ( <FaRegEye/> ) : <FaRegEyeSlash/>}
                   </div>
                   </div>
            
                   <Link to={"/forgot-password"} className="block ml-auto hover:text-primary-200">Forgot Password?</Link>
                </div>

                <button disabled={!validateValue} className={` ${validateValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} 
                        text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                    Login
                </button>
                
            </form>

            <p>
                Do not have an account? <Link to={"/register"}
                className="font-semibold text-green-600 hover:text-green-800">Register</Link>
            </p>

        </div>
    </section>
  )
}

export default Login