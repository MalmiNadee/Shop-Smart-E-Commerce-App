/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import LoadingSpinner from "./LoadingSpinner";
import { useSelector } from "react-redux";
import {FaPlus, FaMinus} from "react-icons/fa6"

const AddToCartButton = ({ data }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [ loading, setLoading ] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
   const [ isAvailableCart, setIsAvailableCart ] = useState(false)
   const [qty, setQty ] = useState(0)
   const [ cartItemDetails, setCartItemDetails ] = useState()

  //  console.log("AddToCartButton",cartItem)  //get all added cart items

    const handleAddToCart = async(e) => {
        e.preventDefault();   // Prevent the default button behavior (e.g., form submission or page reload)
        e.stopPropagation();  // Stop the click event to prevent navigating to the product page.
  
        try {
          setLoading(true)
          const response = await Axios({
             ...SummaryAPI.addToCart,
             data : {
              productId : data?._id
             }
          })
          const { data : responseData} = response
          if(responseData.success){
             toast.success(responseData.message)
             if(fetchCartItem){
              fetchCartItem()
             }
          }
        } catch (error) {
          AxiosToastError(error)
        } finally {
          setLoading(false)
        }
      
  
    }

    //checking this item in cart or not
//    useEffect (() => {
//         const checkingItem = cartItem.some(item => item.productId._id === data._id )
//         setIsAvailableCart(checkingItem)
//         // console.log(checkingItem)
//         const product = cartItem.find(item => item.productId._id === data._id)
//         setQty(product?.quantity || 0);
//         setCartItemDetails(product)
//         //console.log(product)

//     },[data,cartItem])

useEffect(() => {
    const product = cartItem.find(item => item.productId._id === data._id);
    setQty(product?.quantity || 0);
    setCartItemDetails(product);
    setIsAvailableCart(!!product && product.quantity > 0); // Ensure button updates correctly
}, [data, cartItem, qty]);  // Add qty as a dependency

    //handle increase item quantity
    const increaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()

        const response = await updateCartItem(cartItemDetails?._id, qty+1)

        if(response.success){
          toast.success("Item Added")
        }
    }
 
    //handle decrease item quantity
    const decreaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()

        if (qty === 1) {
            // Delete item when qty is 1
            await deleteCartItem(cartItemDetails?._id);
            setQty(0);
            setIsAvailableCart(false); // Hide buttons after removal
          } else {
            // Update quantity by decreasing
            const response = await updateCartItem(cartItemDetails?._id, qty - 1);
            setQty(qty - 1);

            if(response.success){
              toast.success("Item Removed")
            }
          }
         
       
    }


  return (
    <div className="w-full max-w-[150px]">
        {
            isAvailableCart ? (
                <div className="flex w-full h-full">
                    <button onClick={decreaseQty} className="bg-green-600 hover:bg-green-700 text-white 
                    flex-1 w-full p-1 rounded flex items-center justify-center"><FaMinus/></button>
                    <p className="flex-1 w-full px-1 font-semibold">{qty}</p>
                    <button onClick={increaseQty} className="bg-green-600 hover:bg-green-700 text-white 
                    flex-1 w-full p-1 rounded flex items-center justify-center"><FaPlus/></button>
                </div>
            ) : (
                <button onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded">
                {   loading ? <LoadingSpinner/> : "Add" }
                </button>
            )
        }  
    </div>
  )
}

export default AddToCartButton