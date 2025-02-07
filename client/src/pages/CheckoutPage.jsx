import { useState } from "react"
import { useGlobalContext } from "../provider/GlobalProvider"
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees"
import AddAddressBox from "../components/AddAddressBox"
import { useSelector } from "react-redux"
import Axios from "../utils/Axios"
import AxiosToastError from "../utils/AxiosToastError"
import SummaryAPI from "../common/SummaryAPI"
import toast from "react-hot-toast"
import { useNavigate } from 'react-router-dom';
import { loadStripe} from '@stripe/stripe-js';


const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddressBox, setOpenAddressBox ] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const [ selectAddress , setSelectAddress ] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()

  //to handle cash on delivery
  const handleCashOnDeliveryOrder = async() => {
     try {
        const response = await Axios({
          ...SummaryAPI.cashOnDeliveryOrder,
          data : {
            item_list : cartItemsList,  //array
            addressID : addressList[selectAddress]?._id, 
            subTotalAmount : totalPrice,
            totalAmount : totalPrice
          }
        })
        const { data : responseData } = response

        if (!selectAddress) {
          toast.error("Please select an address.");
          return;
      }

        if(responseData.success){
          toast.success(responseData.message)

          //if order successfull call these APIs
          if(fetchCartItem){
            fetchCartItem()
          }
          if(fetchOrder){
            fetchOrder()
          }
          navigate('/success',{
            state : {
              text : "Order"
            }
          })
              
        }
     } catch (error) {
       AxiosToastError(error)
     }
  }

  //to handle online payment
  const handleOnlinePayment = async() => {
    try {
      const selectedAddressId = addressList[selectAddress]?._id;
        
        if (!selectAddress) {
            toast.error("Please select an address.");
            return;
        }

        if (!selectedAddressId) {
          toast.error("Delivery address required.");
          return;
      }
      
      toast.loading("Loading")
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
      const stripepromise = await loadStripe(stripePublicKey)

      //if order successfull call these APIs
      if(fetchCartItem){
        fetchCartItem()
      }
      if(fetchOrder){
        fetchOrder()
      }

      // console.log(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        if (!stripePublicKey) {
            toast.error("Stripe public key is missing!");
            return;
        }
        

      const response = await Axios ({
        ...SummaryAPI.payment_url,
        data : {
            item_list : cartItemsList, 
            addressID : addressList[selectAddress]?._id, 
            subTotalAmount : totalPrice,
            totalAmount : totalPrice
        }
      })

      const { data : responseData } = response

     await stripepromise.redirectToCheckout({ sessionId : responseData.id })
      


     } catch (error) {
        AxiosToastError(error)
     }
  }

 


  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
        <div className="w-full">
          {/* left section  address part */}
          <h3 className="text-lg font-semibold">Choose your address</h3>
          <div className="bg-white p-2 grid gap-4">
              {
                addressList.map((address,index) => {
                  return (  
                    <label key={address+index}  htmlFor={"address"+index}>
                     <div className="border rounded p-3 flex gap-3 hover:bg-blue-100">
                         <div>
                            <input id={"address"+index} type="radio" value={index} onChange={(e)=> setSelectAddress(e.target.value)} name="address"/>
                         </div>
                         <div>
                            {/* <p className="font-semibold">{user.name}</p> */}
                            <p>{address.address_line}</p>
                            <p>{address.city}</p>
                            <p>{address.state}</p>
                            <p>{address.country} - {address.pincode}</p>
                            <p>{address.mobile}</p>
                         </div>
                    </div>
                    </label>
                  )
                })
              }
              <div onClick={() =>setOpenAddressBox(true)} className="h-16 bg-blue-100 border-2 border-dashed 
               flex items-center justify-center cursor-pointer" >  Add Address
              </div>
          </div>
         
        </div>

        <div className="w-full max-w-md bg-white py-4 px-2">
          {/* right section  summary of order part */}
          <h3 onClick={() => setOpenAddressBox(true)} className="text-lg font-semibold">Summary</h3>
            {/* display all billing details */}
              <div className="bg-white p-4">
                            <h3 className="font-semibold">Bill Details</h3>
                            <div className="flex gap-4 justify-between ml-2">
                                 <p>Items Total</p>
                                 <p className="flex items-center gap-2">
                                    <span className="line-through text-neutral-600">{DisplayPriceInRupees(notDiscountTotalPrice)}</span>
                                    <span>{DisplayPriceInRupees(totalPrice)}</span>
                                 </p>
                            </div>
                            <div className="flex gap-4 justify-between ml-2">
                                 <p>Quantity Total</p>
                                 <p className="flex items-center gap-2">{totalQty} Items</p>
                            </div>
                            <div className="flex gap-4 justify-between ml-2">
                                 <p>Delivery Charge</p>
                                 <p className="flex items-center gap-2">Free</p>
                            </div>
                            <div className="font-semibold flex gap-4 justify-between"> <p>Grand Total</p>
                                 <p>{DisplayPriceInRupees(totalPrice)}</p>
                            </div>
              </div>
          <div className="w-full flex flex-col gap-4">
            <button onClick={handleOnlinePayment} className="py-2 px-4 bg-green-600 text-white 
                    font-semibold hover:bg-green-700 rounded">Online Payment</button>
            <button onClick={handleCashOnDeliveryOrder} className="py-2 px-4 border-2 border-green-600 text-green-600 
                    font-semibold hover:bg-green-600 hover:text-white rounded">Cash On Delivery</button>
          </div>
        </div>
      </div>
      {
        openAddressBox && (
          <AddAddressBox close={()=> setOpenAddressBox(false)}/>
        )
      }
    </section>
  )
}

export default CheckoutPage