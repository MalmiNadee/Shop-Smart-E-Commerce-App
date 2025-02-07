import { useState } from "react"
import { useSelector } from "react-redux"
import AddAddressBox from "../components/AddAddressBox"
import {MdDelete} from 'react-icons/md'
import {MdEdit} from 'react-icons/md'
import EditAddressDetails from "../components/EditAddressDetails"
import AxiosToastError from "../utils/AxiosToastError"
import Axios from "../utils/Axios"
import SummaryAPI from "../common/SummaryAPI"
import toast from "react-hot-toast"
import { useGlobalContext } from "../provider/GlobalProvider"


const Address = () => {
  const addressList = useSelector(state => state.addresses.addressList)
  const [openAddressBox, setOpenAddressBox ] = useState(false)
  const [openEditAddressBox, setOpenEditAddressBox ] = useState(false)
  const [editData, setEditData] = useState({})
  const { fetchAddress } = useGlobalContext()

  //to disable address form frontend
  const handleDisableAddress = async(id) => {
    try {
        const response = await Axios ({
          ...SummaryAPI.disableAddress,
          data : {
            _id : id
          }
        })

        if(response.data.success){
            toast.success("Address Removed")
            if(fetchAddress){
              fetchAddress()
            }
        }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className="">
       <div className="bg-white shadow-lg px-2 py-2 flex items-center justify-between gap-4">
            <h2 className="font-semibold text-ellipsis line-clamp-1">Address</h2>
            <button onClick={() =>setOpenAddressBox(true)} className="text-green-600 border border-green-600 
            px-2 py-1 rounded hover:bg-green-500 hover:text-black">Add Address</button>
       </div>
        <div className="bg-blue-50 p-2 grid gap-4">
              {
                addressList.map((address,index) => {
                  return (  
                    <label key={address+index}  htmlFor={"address"+index} className={!address.status && 'hidden'}>
                     <div className={`border rounded p-3 flex gap-3 bg-white hover:bg-blue-200 ${!address.status && 'hidden'}`}>
                         <div className="w-full">
                            {/* <p className="font-semibold">{user.name}</p> */}
                            <p>{address.address_line}</p>
                            <p>{address.city}</p>
                            <p>{address.state}</p>
                            <p>{address.country} - {address.pincode}</p>
                            <p>{address.mobile}</p>
                         </div>
                         <div className="grid gap-10 p-1">
                            <button onClick={()=>{setOpenEditAddressBox(true), setEditData(address)} } className="bg-green-200 p-1 rounded 
                                  hover:text-white hover:bg-green-600"><MdEdit size={25}/></button>
                            <button onClick={()=> handleDisableAddress(address._id)} className="bg-red-200 p-1 rounded hover:text-white hover:bg-red-600"><MdDelete size={25}/></button>
                         </div>
                    </div>
                    </label>
                  )
                })
              }
              <div onClick={() =>setOpenAddressBox(true)} className="h-16 bg-blue-100 border-2 border-dashed 
               flex items-center justify-center cursor-pointer hover:bg-blue-300" >  Add Address
              </div>
        </div>
        {
          openAddressBox && (
            <AddAddressBox close={()=>setOpenAddressBox(false)}/>
          )
        }
        {
          openEditAddressBox && (
            <EditAddressDetails data={editData} close={()=>setOpenEditAddressBox(false)}/>
          )
        }
    </div>
  )
}

export default Address