/* eslint-disable react/prop-types */
import { useSelector } from "react-redux"
import isAdmin from "../utils/isAdmin"


const AdminPermission = ({children}) => {
    const user = useSelector(state => state.user) //get current user details from redux

  return (
     <>
        {
            isAdmin(user.role) ? children : <p className="text-red-600 bg-red-100 p-4">Do not have Permission</p>
        }
     </>
  )
}

export default AdminPermission