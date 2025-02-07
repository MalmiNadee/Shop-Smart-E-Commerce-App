/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from "react";
import SummaryAPI from "../common/SummaryAPI";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import toast from "react-hot-toast";
import { PriceWithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null)

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({children}) => {
    const dispatch = useDispatch()
    const cartItem = useSelector(state => state.cartItem.cart);
    const user = useSelector(state => state?.user);
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQty, setTotalQty] = useState(0)
    const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0)

//get all cartItem details 
const fetchCartItem = async() => {
    try {
      const response = await Axios ({
        ...SummaryAPI.getCartItem
      })
      const {data : responseData} = response
      if(responseData.success){
        dispatch(handleAddItemCart(responseData.data))
       // console.log(responseData)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

//to increase and decrease item quantity
const updateCartItem = async(id, qty) => {
  try {
    const response = await Axios({
      ...SummaryAPI.updateCartItemQty,
      data : {
        _id : id,
        qty : qty
      }
    })
    const { data : responseData } = response
    if(responseData.success){
      //toast.success(responseData.message)
      fetchCartItem()
      return responseData
    }
  } catch (error) {
    AxiosToastError(error)
    return error
  }
}

//to delete cart item
const deleteCartItem = async(cartId) => {
  try {
    const response = await Axios({
      ...SummaryAPI.deleteCartItem,
      data : {
        _id : cartId
      }
    })
    const { data : responseData } = response
    if(responseData.success){
      toast.success(responseData.message)
      fetchCartItem()
    }
  } catch (error) {
    AxiosToastError(error)
  }
}

const handleLogout = () => {
    localStorage.clear()  //after logout clear the local storage
    dispatch(handleAddItemCart([])) //cart get empty
  }

//to get all addresses
const fetchAddress = async() => {
  try {
    const response = await Axios({
      ...SummaryAPI.getAddress
    })

    const { data : responseData } = response
    if(responseData.success){
        dispatch(handleAddAddress(responseData.data))
    }
  } catch (error) {
    AxiosToastError(error)
  }
}

//to get all orders
const fetchOrder = async() => {
  try {
     const response = await Axios({
      ...SummaryAPI.getOrderItems
     })

     const { data : responseData } = response //extract data of backend side
     //console.log("response",response)
     if(responseData.success){
       dispatch(setOrder(responseData.data))
     }
  } catch (error) {
     AxiosToastError(error)
  }
}

  useEffect(()=> {
    fetchCartItem()
    handleLogout()
    fetchAddress()
    fetchOrder()
  },[user])

   //total items and total price
  useEffect(()=> {
    const qty = cartItem.reduce((preve,curr) => {
       return preve + curr.quantity
    },0) //inital state 0
    setTotalQty(qty)
    //console.log("qty",qty)

    const totalPrice = cartItem.reduce((preve,curr)=> {
      const priceAfterDiscount = PriceWithDiscount( curr?.productId?.price, curr?.productId?.discount )
    // console.log("priceAfterDiscount", priceAfterDiscount)
      return preve + (priceAfterDiscount * curr.quantity)
    },0)
    setTotalPrice(totalPrice)

    const notDiscountTotalPrice = cartItem.reduce((preve,curr)=> {
      return preve + (curr?.productId?.price  * curr.quantity)
    },0)
    setNotDiscountTotalPrice(notDiscountTotalPrice)
    
    //console.log("totalPrice" , totalPrice)
  },[cartItem])


    return (
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            fetchAddress,
            fetchOrder,
            totalPrice,
            totalQty,
            cartItem,
            notDiscountTotalPrice       
        }}>
            {children}
        </GlobalContext.Provider>
    )

}

export default GlobalProvider;
