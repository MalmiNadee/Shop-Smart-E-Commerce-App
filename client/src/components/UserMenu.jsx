import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import Divider from "./Divider"
import Axios from './../utils/Axios';
import SummaryAPI from "../common/SummaryAPI";
import { logout } from "../store/userSlice";
import toast from 'react-hot-toast';
import AxiosToastError from './../utils/AxiosToastError';
import {HiOutlineExternalLink} from "react-icons/hi"
import isAdmin from "../utils/isAdmin";


// eslint-disable-next-line react/prop-types
const UserMenu = ({ close }) => {

    //display user details in menu
    const user = useSelector((state ) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async()=> {

      try {
        const response = await Axios({
          ...SummaryAPI.logout

        })
        if(response?.data?.success){
          if (close) {
            close(); // Close the menu after logout
          }
            dispatch(logout())
            localStorage.clear()
            toast.success(response.data.message)
            //window.history.back()   //redirect to previous page
            navigate("/")    //redirect to home page
            
        }
      } catch (error) {
        AxiosToastError(error)
      }

   

    }

    const handleClose = () => {
      if(close){
        close()
      }
    }

  return (
    <div>
        <div className="font-semibold"> My Account </div>
        <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
            {user.name || user.mobile}
            <span className="font-medium text-red-600">  {user.role === "ADMIN" ? "(Admin)" : ""}</span>
        </span>
           <Link onClick={handleClose} to={"/dashboard/profile"} className="hover:text-secondary-200">
              <HiOutlineExternalLink size={20}/>
           </Link>
        </div>

        <Divider/>
        <div className="text-sm grid gap-1">
            {/* only admin can see this pages */}
            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/category"} className="px-1 hover:bg-green-200 py-1">Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/sub-category"} className="px-1 hover:bg-green-200 py-1">Sub Category</Link>
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/upload-product"} className="px-1 hover:bg-green-200 py-1">Upload Product</Link>               
              )
            }

            {
              isAdmin(user.role) && (
                <Link onClick={handleClose} to={"/dashboard/product"} className="px-1 hover:bg-green-200 py-1">Product</Link>              
              )
            }

            <Link onClick={handleClose} to={"/dashboard/myorders"} className="px-1 hover:bg-green-200 py-1">My Orders</Link> 

            <Link onClick={handleClose} to={"/dashboard/address"} className="px-1 hover:bg-green-200 py-1">Save Address</Link> 
            
            <button onClick={handleLogout} className="px-1 text-left hover:bg-green-200 py-1">Log out</button>
        </div>
    </div>
  )
}

export default UserMenu

// max-w-52 text-ellipsis line-clamp-1 => These classes limit the width, add "..." for long text, and keep it to one line and display icon