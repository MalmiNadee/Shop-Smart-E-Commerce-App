/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';
import { DisplayPriceInRupees } from './../utils/DisplayPriceInRupees';
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import SummaryAPI from '../common/SummaryAPI';
import { PriceWithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from '../components/AddToCartButton';



const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0] // Extract product ID from URL parameters.

  const [data,setData] = useState({
    name : "",
    image : []
  })  // State to manage product data, including images.
  const [image, setImage] = useState(0); // Track currently displayed image index.
  const [loading, setLoading] = useState(false); // Track loading state.
  const imageContainer = useRef()

 

  const fetchProductDetails = async()=>{
    try {
        const response = await Axios({
          ...SummaryAPI.getProductDetails,
          data : {
            productId : productId // Send product ID in the request.
          }
        })

        const { data : responseData } = response

        if(responseData.success){
          setData(responseData.data) // Update state with fetched product data.
        }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchProductDetails() // Fetch product details on component mount or params change.
  },[params])

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100
  }
  
  
 // console.log("product data",data)
  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-2 '>
      
      {/* Left Section */}
       {/* Main Product Image Section */}
        <div className=''>
            <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
                <img
                    src={data.image[image]}
                    className='w-full h-full object-scale-down'
                /> 
            </div>

           {/* Circles for Image Selection */} 
            <div className='flex items-center justify-center gap-3 my-2'>
              {
                data.image.map((img,index)=>{
                  return(
                    <div key={img+index+"point"} 
                    className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-slate-500"}`}></div>
                  )
                })
              }
            </div>

             {/* Mini Product Images Section */}
            <div className='grid relative'>
                <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
                      {
                        data.image.map((img,index)=>{
                          return(
                            <div className='w-20 h-20 min-h-20 min-w-20 scr cursor-pointer shadow-md' key={img+index}>
                              <img
                                  src={img}
                                  alt='min-product'
                                  onClick={()=>setImage(index)}
                                  className='w-full h-full object-scale-down' 
                              />
                            </div>
                          )
                        })
                      }
                </div>
                <div className='w-full -ml-4 h-full flex justify-between absolute items-center'>
                  <button onClick={handleScrollLeft} className='z-10 bg-white p-1 relative rounded-full shadow-lg'>
                      <FaAngleLeft/>
                  </button>
                  <button onClick={handleScrollRight} className='z-10 bg-white p-1 relative rounded-full shadow-lg'>
                      <FaAngleRight/>
                  </button>
                </div>
              
            </div>

            <div className='my-4 hidden lg:grid gap-3'>
               <div>
               <p className='font-semibold'>Description</p>
               <p className='text-base'>{data.description}</p>
               </div>

               <div>
               <p className='font-semibold'>Unit</p>
               <p className='text-base'>{data.unit}</p>
               </div>

               {
                data?.more_details && Object.keys(data.more_details).map((element,index)=> {
                  return (
                    <div key={element+index+"moredetails"}>
                      <p className="font-semibold">{element}</p>
                      <p className="text-base">{data.more_details[element]}</p>
                    </div>
                  );
                })
               }
            </div>
       </div>

        
        


            {/* Right Section */}
            <div className='p-4 pl-7 text-base lg:text-lg'>
               <p className='bg-green-300 w-fit px-2 rounded'>10 Min</p>
               <h2 className='text-lg font-semibold lg:text-3xl'>{data.name}</h2>
               <p>{data.unit}</p>
               <Divider/>
               <div>
                  <p>Price</p>
                  <div className='flex items-center gap-2 lg:gap-4'>
                     <div className='border border-green-600 px-4 py-2 rounded bg-green-100 w-fit'>
                      <p className='font-semibold text-lg lg:text-xl'>{DisplayPriceInRupees(PriceWithDiscount(data.price, data.discount))} </p>
                     </div>
                     {
                      data.discount && (
                        <p className='line-through text-lg'>{DisplayPriceInRupees(data.price)}</p>
                      )
                    }
                    {
                      data.discount && (
                        <p className='font-bold text-green-600 lg:text-2xl'>{data.discount}% 
                        <span className='text-base text-neutral-500'>Discount</span></p>
                      )
                    }
                  </div>
               </div>

               {
                  data.stock === 0 ? (
                    <p className='text-lg text-red-500 my-2'>Out of Stock</p>
                  ) : (
                    //<button className='my-4 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded'>Add to Cart</button>
                    <div className='my-4'>
                    <AddToCartButton data={data}/>
                    </div>
                  )
               }

              

               <h2 className='font-semibold'>Why shop from ShopSmart?</h2>
               {/* Image 1 */}
               <div>
                  <div className='flex items-center gap-4 my-4'>
                    <img src={image1} alt='superfast delivery' className='w-20 h-20'/>
                    <div className='text-sm'>
                      <div className='font-semibold'>SuperFast Delivery</div>
                      <p> Fast delivery from nearby stores, straight to your doorstep.</p>        
                    </div>
                  </div>
               </div>
               {/* Image 2 */}
               <div>
                  <div className='flex items-center gap-4 my-4'>
                    <img src={image2} alt='best price offers' className='w-20 h-20'/>
                    <div className='text-sm'>
                        <div className='font-semibold'>Best Prices & Offers</div>
                        <p>Shop at unbeatable prices with exclusive manufacturer deals.</p>
                      </div>
                  </div>
               </div>
               {/* Image 3 */}
               <div>
                  <div className='flex items-center gap-4 my-4'>
                    <img src={image3} alt='best price offers' className='w-20 h-20'/>
                    <div className='text-sm'>
                        <div className='font-semibold'>Wide Assortment</div>
                        <p>Explore over 5000 products spanning food, personal care, household essentials, and more.</p>
                      </div>
                  </div>
               </div>

               {/* only mobile  */}
               
            <div className='my-4 grid gap-3 lg:hidden'>
               <div>
               <p className='font-semibold'>Description</p>
               <p className='text-base'>{data.description}</p>
               </div>

               <div>
               <p className='font-semibold'>Unit</p>
               <p className='text-base'>{data.unit}</p>
               </div>

               {
                data?.more_details && Object.keys(data.more_details).map((element,index)=> {
                  return (
                    <div key={element+index+"moredetails"}>
                      <p className="font-semibold">{element}</p>
                      <p className="text-base">{data.more_details[element]}</p>
                    </div>
                  );
                })
               }
            </div>

            </div>


    </section>
  )
}

export default ProductDisplayPage