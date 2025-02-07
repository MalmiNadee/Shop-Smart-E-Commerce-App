/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react"
import { Link, } from "react-router-dom"
import AxiosToastError from "../utils/AxiosToastError"
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import {FaAngleLeft, FaAngleRight} from "react-icons/fa6"
import { useSelector } from "react-redux";
import {validateURLConvert} from '../utils/validateURLConvert.jsx'


const CategoryWiseProductDisplay = ({id, name}) => {
    const [data,setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector((state) => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async() => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryAPI.getProductByCategory,
                data : {
                    id : id
                }
            })

            const {data : responseData} = response

            if(responseData.success){
                setData(responseData.data)
            }
        //    console.log(responseData)
        } catch (error) {
           AxiosToastError(error) 
        }finally{
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchCategoryWiseProduct()
    },[])  // useEffect run only once so use empty dependency

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }

//   const handleRedirectProductListPage = () => {
//      // console.log(id,name)
//       const subCategory = subCategoryData.find(sub  =>
//       sub.category.some(c => c._id == id)
//       // console.log(sub)
//         );
//         if (!subCategory) {
//             console.error("SubCategory not found for ID:", id);
//             return "/fallback-url"; // Fallback URL
//           }
//       const url = `/${validateURLConvert(name)}-${id}/${validateURLConvert(subCategory?.name)}-${subCategory?._id}`
//     //  navigate(url)
//     //    console.log(url)
//     return url
//   }

const handleRedirectProductListPage = ()=>{
    const subcategory = subCategoryData.find(sub =>{
      const filterData = sub.category.some(c => {
        return c._id == id
      })

      return filterData ? true : null
    })
    const url = `/${validateURLConvert(name)}-${id}/${validateURLConvert(subcategory?.name)}-${subcategory?._id}`

    return url
}


  

  const redirectURL = handleRedirectProductListPage()

  return (
    <div>
          {/*Display category product Section */}

          <div className='container mx-auto p-4 flex items-center justify-between gap-4'>
                <h3 className='font-semibold text-lg mg:text-xl'>{name}</h3>
                <Link to={redirectURL} className='text-green-600 hover:text-green-400'>See All</Link>
          </div>
          <div className="relative flex items-center">
          <div className="flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth" ref={containerRef}>
              {
                loading &&
                loadingCardNumber.map((_,index) => { //can use _ it not using
                    return (
                         <CardLoading key={_+index+"loadingCardNumber"}/>
                    )
                })
              }
              {
                data.map((p,index) => {
                    return (
                        <CardProduct key={p._id+index+"cardProduct"} data={p}/>
                    )
                })
              }
              </div>
              <div className="w-full left-0 right-0 container mx-auto px-2 absolute hidden lg:flex justify-between">
                 <button onClick={handleScrollLeft} className="z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full">
                    <FaAngleLeft/>
                 </button>
                 <button onClick={handleScrollRight} className="z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full">
                    <FaAngleRight/>
                 </button>
              </div>

          </div>
    </div>
  )
}

export default CategoryWiseProductDisplay