import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link, useLocation, useNavigate } from "react-router-dom"
import SummaryAPI from "../common/SummaryAPI"
import Axios from "../utils/Axios"
import AxiosToastError from "../utils/AxiosToastError"
import {FaRegEyeSlash} from "react-icons/fa6";
import {FaRegEye} from "react-icons/fa6";

const ResetPassword = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
   

    const [data, setData] = useState({
        email : "",
        newPassword : "",
        confirmNewPassword : ""
   })
   
   


  // const validateValue = Object.values(data).every(el => el)

  const validateValue = Object.values(data).every(el => el)

   console.log("reset-password page", location.state)


   useEffect(() => {
    console.log("Location State: ", location.state);
    if (!(location?.state?.data?.success)) {
        navigate("/");
    }
    if (location?.state?.email) {
        setData((preve) => ({
            ...preve,
            email: location?.state?.email,
        }));
    }
}, [location,navigate]);



   //console.log("reset password data", data)

      const handleChange = (e) => {
    const {name, value} = e.target

    setData((preve) => {
        return {
            ...preve, //restore previous value
            [name]  : value 
        }
    })
}

   const handleSubmit = async (e) => {
    e.preventDefault()  //stop the refresh page 

    if(data.newPassword !== data.confirmNewPassword){
        toast.error("New Password and Confirm New Password must be same.")
        return
    }

  try {
      const response = await Axios({
        ...SummaryAPI.reset_password,
        data: data
      })

      if(response.data.error){
         toast.error(response.data.message)
      }

      if (response.data.success) {
        toast.success(response.data.message);
        //reset the fields and user direct to verify OTP page
        setData({
            email : "",
            newPassword : "",
            confirmNewPassword : ""
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
         <p className="font-bold text-lg mb-2">Reset Password</p>

        <form className="grid gap-4 mt-6" onSubmit={handleSubmit}>

            <div className="grid gap-1">
               <label htmlFor="newPassword">New Password : </label>
               <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-secondary-200">
                  <input type={showNewPassword ? "text" : "password"}
                  id="newPassword" name="newPassword" className="w-full outline-none" value={data.newPassword} onChange={handleChange}
                  placeholder="Enter Your New Password"
                  />
                  <div onClick={() => setShowNewPassword(preve => !preve)} className="cursor-pointer"> 
                  { showNewPassword ? ( <FaRegEye/> ) : <FaRegEyeSlash/>}
               </div>
               </div>
            </div>
            <div className="grid gap-1">
               <label htmlFor="confirmNewPassword">Confirm New Password : </label>
               <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-secondary-200">
                  <input type={showConfirmNewPassword ? "text" : "password"}
                  id="confirmNewPassword" name="confirmNewPassword" className="w-full outline-none" value={data.confirmNewPassword} onChange={handleChange}
                  placeholder="Enter Your Confirm New Password"
                  />
                  <div onClick={() => setShowConfirmNewPassword(preve => !preve)} className="cursor-pointer"> 
                  { showConfirmNewPassword ? ( <FaRegEye/> ) : <FaRegEyeSlash/>}
               </div>
               </div>
            </div>

            <button disabled={!validateValue} className={` ${validateValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} 
                    text-white py-2 rounded font-semibold my-3 tracking-wide`}>
                Reset Password
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

export default ResetPassword