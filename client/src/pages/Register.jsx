import { useState } from "react"
import {FaRegEyeSlash} from "react-icons/fa6";
import {FaRegEye} from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [data, setData] = useState({
        name : "",
        email : "",
        password : "",
        confirmPassword : "",

    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()

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
        // check password and confirm password same
        if(data.password !== data.confirmPassword){
               toast.error(
                "password and confirm password must be same"
               )
               return 
        }

       try {
           const response = await Axios({
            ...SummaryAPI .register,
            data : data
           })

           if(response.data.error){
              toast.error(response.data.message)
           }

           if(response.data.success){
              toast.success(response.data.message)
              //reset the fields and user direct to login page
              setData({
                 name : "",
                 email : "",
                 password : "",
                 confirmPassword : "",
              })
              navigate("/login")
           }

           // console.log("response", response)
       } catch (error) {
           AxiosToastError(error)
       }

        

    }
   
  return (
    <section className="w-full container mx-auto px-2">
        <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
            <p className="font-bold text-lg mb-2">Welcome to Shop Smart</p>
            

            <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>
                <div className="grid gap-1">
                    <label htmlFor="name">Name : </label>
                    <input type="text" id="name" name="name" className="bg-blue-50 p-2 border rounded outline-none focus:border-secondary-200" 
                    value={data.name} onChange={handleChange} autoFocus placeholder="Enter Your Name"/>
                </div>
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
                </div>
                <div className="grid gap-1">
                   <label htmlFor="confirmPassword">Confirm Password : </label>
                   <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-secondary-200">
                      <input type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword" name="confirmPassword" className="w-full outline-none" value={data.confirmPassword} onChange={handleChange}
                      placeholder="Enter Your Confirm Password"
                      />
                      <div onClick={() => setShowConfirmPassword(preve => !preve)} className="cursor-pointer"> 
                      { showConfirmPassword ? ( <FaRegEye/> ) : <FaRegEyeSlash/>}
                   </div>
                   </div>
                </div>

                <button disabled={!validateValue} className={` ${validateValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} 
                        text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                    Register
                </button>
                
            </form>

            <p>
                Already have an account? <Link to={"/login"}
                className="font-semibold text-green-600 hover:text-green-800">Login</Link>
            </p>

        </div>
    </section>
  )
}

export default Register