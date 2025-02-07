/* eslint-disable react/prop-types */
import { useState } from "react"
import { IoClose } from "react-icons/io5"
import uploadImage from "../utils/UploadImage"
import { useSelector } from "react-redux"
import AxiosToastError from './../utils/AxiosToastError';
import Axios from "../utils/Axios";
import SummaryAPI from "../common/SummaryAPI";
import toast from "react-hot-toast";


const UploadSubCategoryModel = ({close, fetchData}) => {
    const [loading,] = useState(false)
    const [subCategoryData,setSubCategoryData] = useState({
        name : "",
        image : "",
        category : [], //pass category id
    })//to manage data available or not

    const allCategory = useSelector((state) => state.product.allCategory)

  //  console.log("allCategory in SubCategory page", allCategory)

    const handleOnChange = (e) => {
        const {name , value} = e.target

        setSubCategoryData((preve) => {
            return{
                ...preve,
                [name] : value //because of square brackets name consider as variable otherwise it can be field name
            }
        })

    }

    const handleRemoveCategorySelected = (categoryId) => {
       // console.log("categoryId",categoryId)
        const index = subCategoryData.category.findIndex(el => el._id === categoryId)
       // console.log("index",index)
        subCategoryData.category.splice(index,1)
        setSubCategoryData((preve) => {
            return {
              ...preve
            }
        })
    }

    const handleSubmitSubCategory = async(e) => {
      e.preventDefault()
        try {
            const response = await Axios({
              ...SummaryAPI.addSubCategory,
              data :subCategoryData

            })
          
            const {data : responseData} = response
       //     console.log("responseData", responseData)
            if(responseData.success){
              toast.success(responseData.message)
              if(close){
                close()
              }
              if(fetchData){
                fetchData()
              }
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    //get file which user is upload
    const handleUploadSubCategoryImage = async(e) => {
        const file = e.target.files[0]

        if(!file){
            return
         }
        const response = await uploadImage(file);
        const { data: ImageResponse } = response;
     
        setSubCategoryData((preve) => {
           return {
             ...preve,
             image: ImageResponse.data.url,
           };
         });
     
         // console.log(Image)
    }

  //  console.log("subCategoryData", subCategoryData)
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 z-50 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white p-4 rounded">
          <div className="flex items-center justify-between">
                  <h1 className="font-semibold">Add Sub Category</h1>
                  <button onClick={close} className="w-fit block ml-auto">
                    <IoClose size={25} />
                  </button>
          </div>
          <form className="my-3 grid gap-2" onSubmit={handleSubmitSubCategory}>
          <div className="grid gap-1">
            <label htmlFor="subCategoryName">Sub Category Name</label>
            <input
              type="text"
              id="subCategoryName"
              placeholder="Enter Sub Category Name"
              value={subCategoryData.name}
              name="name"
              onChange={handleOnChange}
              className="bg-blue-50 p-3 border border-blue-100 focus-within:border-primary-200 outline-none rounded"
            />
          </div>
          <div className="grid gap-1">
            <p>Sub Category Image</p>
            <div className="flex gap-4 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded">
                {subCategoryData?.image ? (
                  <img
                    alt="subCategory"
                    src={subCategoryData.image}
                    className="w-full h-full object-scale-down border-2 border-gray-300 rounded"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">No Image</p>
                )}
              </div>
              <label htmlFor="uploadSubCategoryImage">
              <div
                       className={`${
                         !subCategoryData.name ? "bg-gray-300" : "border-primary-200 hover:bg-primary-100"
                       } px-4 py-2 rounded font-semibold cursor-pointer border`}>
                      {
                        loading ? "Loading....." : " Upload Image"
                      }
                     </div>
                     <input
                        disabled={!subCategoryData.name}
                       onChange={handleUploadSubCategoryImage}
                       type="file"
                       id="uploadSubCategoryImage"
                       className="hidden"
                     />
                   </label>
            </div>
          </div>
          <div className="grid gap-1">
             <label htmlFor="subCategoryName">Select Sub Category</label>
             <div className="border focus-within:border-primary-200 rounded">
               {/* display value */}
               <div className="flex flex-wrap gap-2"> 
                 {
                   subCategoryData.category.map((cat,index) => {
                       return (
                          <p key={cat._id || index +"selectedValue"} className="bg-white shadow-md px-1 m-1 flex items-center gap-2">
                             {cat.name}
                             <button className="cursor-pointer hover:text-red-600" onClick={() => handleRemoveCategorySelected(cat._id)}>
                                 <IoClose size={20}/>
                             </button>
                          </p>
                       )
                   })
                 }
               </div>
               {/* Select Category => multi selector input box to select multiple category at single time*/}
               <select className="w-full p-2 bg-transparent outline-none" 
               onChange={(e) => {
                    const value = e.target.value
                    const categoryDetails = allCategory.find(el => el._id == value)
                    setSubCategoryData((preve)=> {
                        return{
                            ...preve,
                            category : [...preve.category, categoryDetails ]
                        }
                    })
               }}>
                 <option value={""}>Select Category</option>
                 {
                    allCategory.map((category, index)=> {
                        return (
                            <option value={category?._id} key={category._id || index +"subcategory"}>{category?.name}</option>
                        )
                    })
                 }
               </select>
         </div>
          </div>
         
          <button
           disabled={!subCategoryData.name || !subCategoryData.image}
             className={`${ subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0] ? "bg-green-500 hover:bg-green-600": "bg-gray-300"
           } px-4 py-2 font-semibold mt-4`}>
             Add Sub Category
           </button>
           
        </form>
        </div>
    </section>
  )
}

export default UploadSubCategoryModel