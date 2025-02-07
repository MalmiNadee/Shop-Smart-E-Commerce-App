/* eslint-disable react/prop-types */
import { IoClose } from "react-icons/io5"
import { Link, useNavigate } from "react-router-dom"
import { useGlobalContext } from "../provider/GlobalProvider"
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees"
import { FaCaretRight } from "react-icons/fa"
import { useSelector } from "react-redux"
import AddToCartButton from "./AddToCartButton"
import { PriceWithDiscount } from "../utils/PriceWithDiscount"
import ImageEmpty from "../assets/empty_cart.webp";
import toast from "react-hot-toast"


const DisplayCartItem = ({close}) => {
    const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)  //check user login or not
    //console.log("user",user) //if id available user already  login
    const navigate = useNavigate()
    const redirectToCheckoutPage = () => {
        if(user?._id){
          navigate("/checkout")
          if(close){
            close()
          }
          return
        }
        toast("Please Login")
    }
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-70 z-50">
      <div className="bg-white max-w-sm w-full min-h-screen max-h-screen ml-auto">
        <div className="flex items-center p-4 shadow-md gap-3 justify-between">
          <h2 className="font-semibold">Cart</h2>
          <Link to={"/"} className="lg:hidden">
            <IoClose size={25} />
          </Link>
          <button onClick={close} className="hidden lg:block">
            <IoClose size={25} />
          </button>
        </div>

        <div className="lg:min-h-[80vh] min-h-[75vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4">
          {/* display items */}
          {cartItem[0] ? (
            <>
              <div className="flex items-center px-4 py-2 bg-blu-100 text-blue-500 rounded-full justify-between">
                <p>Your Total Savings</p>
                <p>
                  {DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}
                </p>
              </div>

              {/* display all items */}
              <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto">
                {cartItem[0] &&
                  cartItem.map((item, index) => {
                    return (
                      <div key={item + index} className="flex w-full gap-4">
                        <div className="h-20 min-h-20 max-h-20 w-40 border rounded">
                          <img
                            src={item?.productId?.image[0]}
                            className="object-scale-down"
                          />
                        </div>
                        <div className="w-full max-w-sm text-sm">
                          <p className="text-ellipsis line-clamp-2">
                            {item?.productId?.name}
                          </p>
                          <p className="text-neutral-500">
                            {item?.productId?.unit}
                          </p>
                          <p className="font-semibold text-neutral-500">
                            {DisplayPriceInRupees(
                              PriceWithDiscount(
                                item?.productId?.price,
                                item?.productId?.discount
                              )
                            )}
                          </p>
                        </div>
                        <div>
                          <AddToCartButton data={item.productId} />
                        </div>
                      </div>
                    );
                  })}
              </div>

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


            </>
          ) : (
            //if items not available
            <div className="bg-white flex flex-col justify-center items-center">
              <img src={ImageEmpty}  className="w-full h-full object-scale-down"/>
              <Link onClick={close} to={"/"} className="block bg-green-600 px-4 py-2 text-white rounded">Shop Now</Link>
            </div>
          )}
        </div>
      {
        cartItem[0] && (
          <div className="p-2">
            <div className="bg-green-700 text-neutral-100 px-4 font-bold text-base py-4 static bottom-3 rounded flex items-center gap-4 justify-between">
              <div>{DisplayPriceInRupees(totalPrice)}</div>
              <button onClick={redirectToCheckoutPage} className="flex items-center gap-1">
                Proceed
                <span>
                  <FaCaretRight />
                </span>
              </button>
            </div>
          </div>
        ) 
      }
      </div>
    </section>
  );
}

export default DisplayCartItem