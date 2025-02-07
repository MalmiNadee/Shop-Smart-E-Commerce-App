import { useState } from "react"
import toast from 'react-hot-toast';
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [data, setData] = useState({
        email : "",
    })

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

       try {
           const response = await Axios({
            ...SummaryAPI .forgot_password,
            data : data
           })

           if(response.data.error){
              toast.error(response.data.message)
           }

           if(response.data.success){
              toast.success(response.data.message)
              //reset the fields and user direct to verify OTP page
              navigate("/verify-otp", {
                state : data
              })
              setData({
                 email : "",
              })
              
           }

           // console.log("response", response)
       } catch (error) {
           AxiosToastError(error)
       }

        

    }
   
  return (
    <section className="w-full container mx-auto px-2">
        <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
            <p className="font-bold text-lg mb-2">Forgot Password</p>

            <form className="grid gap-4 py-6" onSubmit={handleSubmit}>
      
                <div className="grid gap-1">
                    <label htmlFor="email">Email : </label>
                    <input type="email" id="email" name="email" className="bg-blue-50 p-2 border rounded outline-none focus:border-secondary-200" 
                    value={data.email} onChange={handleChange} placeholder="Enter Your Email"/>
                </div>

                <button disabled={!validateValue} className={` ${validateValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} 
                        text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                    Send OTP
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

export default ForgotPassword