/* eslint-disable react/prop-types */
import { useForm  } from 'react-hook-form' //only this because we use javascript
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryAPI from '../common/SummaryAPI'
import toast from 'react-hot-toast'
import { IoClose } from 'react-icons/io5';
import { useGlobalContext } from '../provider/GlobalProvider'

const EditAddressDetails = ({close, data}) => {
    const  { register, handleSubmit, reset } = useForm({
        defaultValues : {
            _id : data._id,
            userId: data.userId,
            address_line  : data.address_line, 
            city : data.city, 
            state : data.state,
            pincode : data.pincode, 
            country : data.country, 
            phone : data.phone
        }
    })
    const { fetchAddress } = useGlobalContext()

    const onSubmit = async(data) => {
      try {
        const response = await Axios({
          ...SummaryAPI.updateAddress,
           data : {
            ...data,
            address_line  : data.address_line, 
            city : data.city, 
            state : data.state,
            pincode : data.pincode, 
            country : data.country, 
            phone : data.phone
           }
        })
        const { data : responseData } = response
        if(responseData.success){
             toast.success(responseData.message)
             if(close){
              close()
              reset()
              fetchAddress()
             }
        }
      } catch (error) {
        AxiosToastError(error)
      }
    }
  return (
    <section className="bg-black fixed top-0 bottom-0 left-0 right-0 z-50 bg-opacity-70 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white w-full max-w-lg p-4 mt-8 mx-auto rounded">
        <div className='flex items-center justify-between gap-4'>
           <h2 className="font-semibold">Edit Address</h2>
           <button onClick={close} className='hover:text-red-500'>
               <IoClose size={25}/>
           </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4">
            <div className="grid gap-1">
                           {/* automatically focus here htmlFor */}
                <label htmlFor='addressline'>Address Line : </label> 
                <input type="text" id="addressline" className="border bg-blue-50 p-2 rounded" {...register("address_line",{required : true })} />
            </div>
            <div className="grid gap-1">
                <label htmlFor='city'>City : </label>
                <input type="text" id="city" className="border bg-blue-50 p-2 rounded" {...register("city",{required : true })} />
            </div>
            <div className="grid gap-1">
                <label htmlFor='state'>State : </label>
                <input type="text" id="state" className="border bg-blue-50 p-2 rounded" {...register("state",{required : true })} />
            </div>
            <div className="grid gap-1">
                <label htmlFor='pincode'>Pincode : </label>
                <input type="text" id="pincode" className="border bg-blue-50 p-2 rounded" {...register("pincode",{required : true })} />
            </div>
            <div className="grid gap-1">
                <label htmlFor='country'>Country : </label>
                <input type="text" id="country" className="border bg-blue-50 p-2 rounded" {...register("country",{required : true })} />
            </div>
            <div className="grid gap-1">
                <label htmlFor='phone'>Phone Number : </label>
                <input type="text" id="phone" className="border bg-blue-50 p-2 rounded" {...register("phone",{required : true })} />
            </div>

            <button type='submit' className='bg-green-600 w-full py-2 mt-4 font-semibold hover:bg-green-500 rounded'>Submit</button>
        </form>

      </div>

    </section>
  )
}

export default EditAddressDetails