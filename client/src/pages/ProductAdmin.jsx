/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import AxiosToastError from "../utils/AxiosToastError"
import LoadingSpinner from './../components/LoadingSpinner';
import ProductCardAdmin from "../components/ProductCardAdmin";
import {IoSearchOutline} from "react-icons/io5";
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search, setSearch] = useState("")

  const fetchProductData = async() => {
        try {
           setLoading(true)
            const response = await Axios({
                ...SummaryAPI.getProduct,
                data : {
                    page : page,
                    limit : 12,
                    search : search
                }
            })
            const {data : responseData} = response
            if(responseData.success){
                setProductData(responseData.data)
            }
    //    console.log("responseData",responseData)
        } catch (error) {
            AxiosToastError(error)
        }finally {
          setLoading(false)
        }
  }

   // Effect for fetching data when page changes
   useEffect(() => {
    fetchProductData();
  }, [page]); // Trigger this effect when 'page' value changes

  const handleNextButton = () => {
    if(page !== totalPageCount){
      setPage(preve => preve + 1)
    }
  }

  const handlePreviousButton = () => {
    if(page > 1){
      setPage(preve => preve -1)
    }
  }

  const handleOnChange = (e) => {
     const {value} = e.target
     //when search something page no changed to one
     setSearch(value)
     setPage(1)
  }

  // Debounced effect for search functionality
  useEffect(() => {
    let flag = true //calling n no of times to reduce that set a flag
    const interval = setTimeout(() => {
      if(flag){
        fetchProductData();
        flag = false
      }
    }, 300); // 300ms delay for debouncing

    return () => clearTimeout(interval); // Cleanup timeout on subsequent render
  }, [search]); // Trigger this effect when 'search' value changes

   // console.log("search", search);
  //  console.log("page", page);

  return (
    <section>
      <div className="p-4 bg-white shadow-md flex items-center justify-between gap-4">
       
              <h2 className="font-bold">Product</h2>
              <div className="h-full min-w-24 max-w-56 w-full ml-auto px-4 py-2 bg-blue-50 flex items-center gap-3 rounded border focus-within:border-secondary-200">
                  <IoSearchOutline size={25}/>
                  <input type="text" value={search} onChange={handleOnChange}
                  placeholder="Search Product here....." className="h-full w-full bg-transparent outline-none"/>
              </div>
            </div>
        {
          loading && (
            <LoadingSpinner/>
          )
        }
        <div className="px-2 lg:px-4 py-2 lg:py-4 bg-blue-50">
         <div className="min-h-[58vh]">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-4">
           {
          productData.map((product,index) => {
            return (
              <ProductCardAdmin key={product._id+ index} data={product} fetchProductData ={fetchProductData} />
            )
          })
           }
          </div>
         </div>
          
          <div className="flex justify-between my-4">
            <button onClick={handlePreviousButton} className="border border-secondary-200 px-2 py-1 hover:bg-secondary-200">Previous</button>
            <button className="w-full bg-slate-200">{page}/{totalPageCount}</button>
            <button onClick={handleNextButton} className="border border-secondary-200 px-2 py-1 hover:bg-secondary-200">Next</button>
          </div>
       </div>
      
    </section>
  )
}

export default ProductAdmin