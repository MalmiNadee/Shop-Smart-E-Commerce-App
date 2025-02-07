/* eslint-disable react/prop-types */
import { useState } from "react"
import {FaCloudUploadAlt} from "react-icons/fa"
import uploadImage from "../utils/UploadImage"
import LoadingSpinner from './../components/LoadingSpinner';
import ViewImage from './../components/ViewImage';
import {MdDelete} from "react-icons/md"
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddFieldComponent from "../components/AddFieldComponent";
import Axios from "../utils/Axios";
import AxiosToastError from './../utils/AxiosToastError';
import SuccessAlert from "../utils/SuccessAlert";
import SummaryAPI from "../common/SummaryAPI";

const EditProductAdmin = ({close, data, fetchProductData}) => {

    const [editData, setEditData] = useState({
        _id : data._id,
        name: data.name,
        image: data.image,
        category: data.category,
        subCategory: data.subCategory,
        unit: data.unit,
        stock: data.stock,
        price: data.price,
        discount: data.discount,
        description: data.description,
        more_details: data.more_details || {},
     
      })
      const [imageLoading, setImageLoading] = useState(false)
      const [viewImageURL, setViewImageURL] = useState(false)
      const allCategory = useSelector(state => state.product.allCategory)
      const [selectCategory, setSelectCategory] = useState("")
      const [selectSubCategory, setSelectSubCategory] = useState("")
      const allSubCategory = useSelector(state => state.product.allSubCategory)
      //const [moreField, setMoreField] = useState([])
      const [openAddField, setOpenAddField] = useState(false)
      const [fieldName, setFieldName] = useState("")
    
      const handleChange = (e) => {
        const {name, value} = e.target
    
        setEditData((preve) => {
          return{
            ...preve,
            [name] : value
          }
            
          
        })
      }
    
      const handleUploadImage = async(e) => {
          const file = e.target.files[0]
          if(!file){
            return
          }
    
        setImageLoading(true)
        const response = await uploadImage(file);
        const { data: ImageResponse } = response;
        const imageUrl = ImageResponse.data.url
    
        setEditData((preve) => {
          return {
            ...preve,
            image: [...preve.image, imageUrl]
          };
        });
        setImageLoading(false)
        //  console.log("file", file)
      }
    
      const handleDeleteImage = async(index) => {
           editData.image.splice(index,1)
           setEditData((preve) => {
            return {
              ...preve
            }
           })
      }
    
      //remove category from selection
      const handleRemoveCategory = async(index) => {
        editData.category.splice(index,1)
        setEditData((preve) => {
         return {
           ...preve
         }
        })
    }
    
    //remove subcategory from selection
    const handleRemoveSubCategory = async(index) => {
      editData.subCategory.splice(index,1)
      setEditData((preve) => {
       return {
         ...preve
       }
      })
    }
    
    //add fields for form
    const handleAddField = () => {
        setEditData((preve)=> {
          return {
             ...preve,
             more_details : {
                ...preve.more_details,
                [fieldName] : ""
             }
          }
        })
        setFieldName("")
        setOpenAddField(false)
    }
    
    //update product details
    const handleSubmit = async(e) => {
       e.preventDefault()
       console.log("editData",editData)
    
       try {
         const response = await Axios({
           ...SummaryAPI.updateProductDetails,
           data : editData
         })
         const {data : responseData } = response
         if(responseData.success){
            SuccessAlert(responseData.message)
            if(close){
              close()
            }
            fetchProductData()
            setEditData({
              name: "",
              image: [],
              category: [],
              subCategory: [],
              unit: "",
              stock: "",
              price: "",
              discount: "",
              description: "",
              more_details: {},
            })
         }
       } catch (error) {
         AxiosToastError(error)
       }        
    }

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 p-4 bg-black bg-opacity-60 flex items-center justify-center z-50">
     <div className="bg-white max-w-4xl w-full mx-auto p-4 rounded overflow-y-auto h-full max-h-[95vh]">
     <section>
      <div className="p-4 bg-white shadow-md flex items-center justify-between">
            <h2 className="font-bold">Update Product Details</h2>
            <button>
                <IoClose size={25} onClick={close}/>
            </button>
        </div>
        <div className="grid p-3">
          <form className="grid gap-4" onSubmit={handleSubmit}>
          {/* Name */}
            <div className="grid gap-1">
              <label className="font-medium" htmlFor="name">Name</label>
              <input id="name" type="text" name="name" placeholder="Enter Product Name" value={editData.name} onChange={handleChange} required
                className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
              />
            </div>
            {/* Description */}
            <div className="grid gap-1">
              <label className="font-medium" htmlFor="description">Description</label>
              <textarea id="description" type="text" name="description" placeholder="Enter Product Description" rows={3}
               value={editData.description} onChange={handleChange} required 
               className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none" />
            </div>
            {/* Image */}
            <div>
              <p className="font-medium">Image</p>
             <div>
             <label htmlFor="productImage" className="bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer">
                 <div className="text-center flex justify-center items-center flex-col">
                  {
                    imageLoading ? <LoadingSpinner/> : (
                      <><FaCloudUploadAlt size={40} /><p>Upload Image</p></>
                    )
                  }
                 </div>
                 <input type="file" id="productImage" accept="image/*" className="hidden" onChange={handleUploadImage}/>
             </label>
                 {/* display uplaoded image */}
                 <div className="flex flex-wrap gap-3">
                     {
                        editData.image.map((img,index) => {
                        return (
                          <div  key={img+index} className="h-20 w-20 mt-2 min-w-20 bg-blue-50 border relative group">
                          <img
                            src={img}
                            alt={img}
                            className="w-full h-full object-scale-down cursor-pointer"
                            onClick={()=> setViewImageURL(img)}
                          />
                          <div onClick={() => handleDeleteImage(index)} className="absolute bottom-0 right-0 p-1 bg-red-500 
                          hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer">
                            <MdDelete/>
                          </div>
                          </div>
                        )
                       })
                     }
                 </div>
          
              </div>
            </div>
            {/* Category */}
            <div className="grid gap-1">
               <label className="font-medium">Category</label>
               <div>
                {/* Select Category => multi selector input box to select multiple category at single time*/}
                <select className="w-full p-2 bg-blue-50 outline-none rounded" value={selectCategory} 
                 onChange={(e) => {
                  const value = e.target.value
                  const category = allCategory.find(el => el._id === value)
                  // console.log("value",value)
                  //console.log("category",category)
                  setEditData ((preve) => {
                    return{
                      ...preve,
                      category : [...preve.category, category]
                    }
                  })
                  setSelectCategory("")
                 }} >

                  <option value={""} className="text-neutral-600">Select Category</option>
                  {
                    allCategory.map((category,index) => {
                      return (
                            <option value={category?._id} key={category?._id +index +"productCategory"}>{category?.name}</option>
                        )
                    })
                  }
               </select>
               <div className="flex flex-wrap gap-3">
               {
                editData.category.map((category,index) => {
                  return (
                    <div key={category._id + index+"product"} className="text-sm flex items-center gap-1 bg-blue-100 mt-2">
                      <p>{category.name}</p>
                      <div className="hover:text-red-500 cursor-pointer" onClick={()=> handleRemoveCategory(index)}>
                        <IoClose size={20}/>
                      </div>
                    </div>
                  )
                })
               }
               </div>
               </div>
            </div>
             {/* Sub Category */}
            <div className="grid gap-1">
               <label className="font-medium">Sub Category</label>
               <div>
                {/* Select Category => multi selector input box to select multiple subcategory at single time*/}
                <select className="w-full p-2 bg-blue-50 outline-none rounded" value={selectSubCategory} 
                 onChange={(e) => {
                  const value = e.target.value
                  const subCategory = allSubCategory.find(el => el._id === value)
                  // console.log("value",value)
                  //console.log("category",category)
                  setEditData ((preve) => {
                    return{
                      ...preve,
                      subCategory : [...preve.subCategory, subCategory]
                    }
                  })
                  setSelectSubCategory("")
                 }} >

                  <option value={""} className="text-neutral-600">Select Sub Category</option>
                  {
                    allSubCategory.map((subCategory,index) => {
                      return (
                            <option value={subCategory?._id} key={subCategory?._id+index +"productSubCategory"}>{subCategory?.name}</option>
                        )
                    })
                  }
               </select>
               <div className="flex flex-wrap gap-3">
               {
                editData.subCategory.map((subCategory,index) => {
                  return (
                    <div key={subCategory._id + index+"product"} className="text-sm flex items-center gap-1 bg-blue-100 mt-2">
                      <p>{subCategory.name}</p>
                      <div className="hover:text-red-500 cursor-pointer" onClick={()=> handleRemoveSubCategory(index)}>
                        <IoClose size={20}/>
                      </div>
                    </div>
                  )
                })
               }
               </div>
               </div>
            </div>
              {/* Unit */}
            <div className="grid gap-1">
              <label className="font-medium" htmlFor="unit">Unit</label>
             <input id="unit" type="text" name="unit" placeholder="Enter Product Unit" value={editData.unit} onChange={handleChange} required
              // if name attribute not this field not save in state */}
                className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
              />
            </div>
              {/* Stock */}
              <div className="grid gap-1">
              <label className="font-medium" htmlFor="stock">Number of Stock</label>
             <input id="stock" type="number" name="stock" placeholder="Enter Product Stock" value={editData.stock} onChange={handleChange} required
                className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
              />
            </div>
            {/* Price */}
            <div className="grid gap-1">
              <label className="font-medium" htmlFor="price">Price</label>
             <input id="price" type="number" name="price" placeholder="Enter Product Price" value={editData.price} onChange={handleChange} required
                className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
              />
            </div>
             {/* Discount */}
             <div className="grid gap-1">
              <label className="font-medium" htmlFor="discount">Discount</label>
             <input id="discount" type="number" name="discount" placeholder="Enter Product Discount" value={editData.discount} onChange={handleChange} required
                className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
              />
            </div>

            {/* Add more fields */}
            {/* if object not available display error  */}
              {
                Object?.keys(editData?.more_details)?.map((k,index)=> {
                   return (
                    <div className="grid gap-1" key={k._id+index }>
                      <label htmlFor={k}>{k}</label>
                      <input  id={k} type="text" value={editData?.more_details[k]} required
                        onChange={(e) => {
                          const value = e.target.value
                          setEditData((preve)=> {
                            return {
                              ...preve,
                              more_details : {
                                ...preve.more_details,
                                [k] : value
                              }
                            }
                          })
                        }}
                         className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded" />
                   </div>
                   )
                })
              }
        
            <div onClick={()=> setOpenAddField(true)} className="bg-white hover:bg-primary-200 py-1 px-3 w-32 text-center font-semibold 
                  border border-green-400 hover:text-black cursor-pointer rounded">
              Add Fields
            </div>
            <button className="bg-green-400 hover:bg-green-600 py-2 px-3 w-40 text-center font-semibold rounded">
            Update Product
            </button>
          </form>
        </div>
        {
          viewImageURL && (
            <ViewImage url={viewImageURL} close={() => setViewImageURL("")}/>
          )
        }
        {
          openAddField && (
            <AddFieldComponent 
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              submit={handleAddField}
              close = {()=> setOpenAddField(false)}/>
          )
        }
    </section>

     </div>

    </section>
  )
}

export default EditProductAdmin






