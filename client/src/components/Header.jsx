import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Search from "./Search";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import {  useState } from "react";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  //for any content inside redux can use this useSelector
  const user = useSelector((state) => state.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const { totalPrice, totalQty } = useGlobalContext()
  const cartItem = useSelector(state => state.cartItem.cart);
  // const [totalPrice, setTotalPrice] = useState(0)
  // const [totalQty, setTotalQty] = useState(0)
  const [openCartSection, setOpenCartSection] = useState(false)

  //console.log("cartItem",cartItem)
  

  //console.log(params.search.split(3))
  // console.log("user from store ", user)

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  //after logout userMenu have to close
  const handleCloseUserMenu = () => {
    setOpenUserMenu(false)
  }

  //User menu in mobile version
  const handleMobileUser = () => {
    if(!user._id){  //if user not available redirect to login page
       navigate("/login")
       return
    }
    //if user login in page
    navigate("/user")
  }

  //total items and total price
  // useEffect(()=> {
  //   const qty = cartItem.reduce((preve,curr) => {
  //      return preve + curr.quantity
  //   },0) //inital state 0
  //   setTotalQty(qty)
  //   //console.log("qty",qty)

  //   const totalPrice = cartItem.reduce((preve,curr)=> {
  //     return preve + (curr.productId.price * curr.quantity)
  //   },0)
  //   setTotalPrice(totalPrice)
  //   //console.log("totalPrice" , totalPrice)
  // },[cartItem])

  // console.log("ismobile", isMobile)
  // console.log("isSearchPage", isSearchPage)
  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex items-center flex-col justify-center gap-1 bg-white">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-2 justify-between">
          {/** Logo */}
          <div className="h-full">
            <Link to={"/"} className="h-full flex justify-center items-center">
              <img
                src={logo}
                width={70}
                height={20}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={logo}
                width={50}
                height={20}
                alt="logo"
                className="lg:hidden"
              />
            </Link>
          </div>

          {/** Search */}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/** Login and My Cart */}
          <div className="">
            {/** User icons display in only mobile version */}
            <button className="text-neutral-600 lg:hidden" onClick={handleMobileUser}>
              <FaRegCircleUser size={28} />
            </button>

            {/** Desktop version */}
            <div className="hidden lg:flex items-center gap-10">
              {/** Login */}
              {user?._id ? ( //if user id available
                <div className="relative">
                  <div
                    onClick={() => setOpenUserMenu((preve) => !preve)}
                    className="flex select-none items-center gap-1 cursor-pointer"  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className="absolute right-0 top-12">
                      <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                //if user id not available
                <button onClick={redirectToLoginPage} className="text-lg px-2">
                  Login
                </button>
              )}
              <button onClick={()=> setOpenCartSection(true)} className="flex items-center gap-3 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white">
                {/** Add to cart icons */}
                <div className="animate-bounce">
                  <FaCartShopping size={28} />
                </div>
                <div className="font-semibold text-sm">
                  {
                    cartItem[0] ? (
                      <div>
                         <p> {totalQty} Items</p>
                         <p> {DisplayPriceInRupees(totalPrice)} </p>
                      </div>
                    ) : (
                      <p> My Cart</p>
                    )
                  }
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>

      {
         openCartSection && (
            <DisplayCartItem close={() => setOpenCartSection(false)}/>
         )
      }

    </header>
  );
};

export default Header;
