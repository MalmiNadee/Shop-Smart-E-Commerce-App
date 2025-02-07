import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa"
import UserProfileAvatarUpload from "../components/UserProfileAvatarUpload";
import { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import SummaryAPI from "../common/SummaryAPI";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetails from "../utils/fetchUserDetails";

//display current user details and user able to update details
const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileUpload, setOpenProfileUpload ] = useState(false)  //by default not open 
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [userData, setUserData ]  = useState({
        name : user.name,
        email : user.email,
        mobile : user.mobile,
    })

    const handleSubmit = async(e) => {
        e.preventDefault() //stop refresh the page
        //when update details have to update in database
        try {
            setLoading(true)
            const response = await Axios({
                  ...SummaryAPI.updateUserDetails,
                  data : userData
            })
            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }
        } catch (error) {
            AxiosToastError(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() =>{
     setUserData({
        name : user.name,
        email : user.email,
        mobile : user.mobile, 
        })

    },[user])

    const handleOnChange =  (e) => {
        const {name, value} = e.target

        setUserData((preve) => {
            return {
                ...preve,
                [name] : value  //give brackets because if not it consider as field name not variable
            }
        })
    }
   // console.log("profile", user)
  return (
    <div className="p-4">
        {/* profile upload and display user image */}
        <div className="w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
            {
                user.avatar ? (
                    <img alt={user.name} src={user.avatar} className="w-full h-full"/>
                ) : (
                    <FaRegUserCircle size={65}/>
                ) 
            }
        </div>
        {/* change profile photo */}
        <button onClick={() => setOpenProfileUpload(true)} 
        className="text-xs min-w-20 font-bold rounded border px-3 py-1 mt-3 border-green-800 hover:bg-green-500">
            Change Photo
        </button>
        
        {
            openProfileUpload && (
                <UserProfileAvatarUpload close= {() => setOpenProfileUpload(false)}/>
            )
        }

         {/* display user details in profile (name, mobile, email, changePassword) */}
         <form className="my-4 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid">
                <label className="font-bold">Name</label>
                <input type="text" placeholder="Enter Your Name" value={userData.name} onChange={handleOnChange} name="name"
                className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded" required/>
            </div>
            <div className="grid">
                <label className="font-bold" htmlFor="email">Email</label>
                <input type="email" placeholder="Enter Your Email" value={userData.email} onChange={handleOnChange} name="email" 
                id="email" className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded" required/>
            </div>
            <div className="grid">
                <label className="font-bold" htmlFor="mobile">Mobile Number</label>
                <input type="text" placeholder="Enter Your Mobile Number" value={userData.mobile} onChange={handleOnChange} name="mobile" 
                id="mobile" className="p-2 bg-blue-50 outline-none border focus-within:border-primary-200 rounded" required/>
            </div>

            <button className="border px-4 py-2 font-semibold rounded
            hover:bg-secondary-200 border-secondary-200 text-secondary-200 hover:text-black">
                {
                    loading ? "Loading...." : "Submit"
                }
            </button>
         </form>

    </div>
  )
}

export default Profile

//htmlfor and id should be same otherwise when click text its not focus on that