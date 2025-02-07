/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import UploadSubCategoryModel from "../components/UploadSubCategoryModel.jsx"
import AxiosToastError from "../utils/AxiosToastError.jsx"
import Axios from "../utils/Axios.jsx";
import SummaryAPI from "../common/SummaryAPI.jsx";
import DisplayTable from "../components/DisplayTable.jsx";
import {createColumnHelper} from '@tanstack/react-table'
import ViewImage from "../components/ViewImage.jsx";
import {HiPencil} from "react-icons/hi";
import {MdDelete} from "react-icons/md";
import EditSubCategory from "../components/EditSubCategory.jsx";
import ConfirmBox from "../components/ConfirmBox.jsx";
import toast from "react-hot-toast";

const SubCategoryPage = () => {

  const [openAddSubCategory, SetOpenAddSubCategory] = useState(false)
  const [data, setData ] = useState([])
  const [loading, setLoading ] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageUrl, setImageUrl] = useState("")
  const [openEdit, setOpenEdit ] = useState(false)
  const [editData, setEditData ] = useState({
    _id : ""
  })
  const [deleteSubCategoryData, setDeleteSubCategoryData ] = useState({
    _id : ""
  })
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox ] = useState(false)

  //to fetch data
  const fetchSubCategory = async() => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryAPI.getSubCategory,

      })
      const {data : responseData } = response
      if(responseData.success){
        setData(responseData.data)
        fetchSubCategory()
      }
    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect (() => {
    fetchSubCategory()
  },[])

  const column = [
    columnHelper.accessor('name',{
      header : 'Sub Category Name'
    }),
    columnHelper.accessor('image',{
      header : 'Image',
      cell : ({row}) => {
        //console.log("row", row.original.image)
        return <div className="flex justify-center items-center">
          <img
        src={row.original.image} // Fetch the image URL from the row's 'image' field
        alt={row.original.name}
        className="w-10 h-10 object-cover border border-gray-200 rounded cursor-pointer"
        onClick={() => {
          setImageUrl(row.original.image)
        }}
      />
        </div>
      }
    }),
    columnHelper.accessor('category',{
      header : 'Category Name',
      cell : ({row}) => {
       
        return (
          <>
            {
              row.original.category.map((c,index) => {
                return (
                  <p key={c._id+"table"} className="shadow-md px-1 inline-block">{c.name}</p>
                )
              })
            }
          </>
        )
      }
    }),

    columnHelper.accessor('_id',{
      header : "Action",
      cell : ({row}) => {  //need row because need id of sub category
         return (
          <div className="flex items-center justify-center gap-3">
               <button onClick={() => {
                setOpenEdit(true)
                setEditData(row.original)
               }} className="p-2 bg-green-200 rounded-full hover:text-green-600">
                   <HiPencil size={25}/>
               </button>
               <button onClick={() => {
                setOpenDeleteConfirmBox(true)
                setDeleteSubCategoryData(row.original)
               }}
               className="p-2 bg-red-200 rounded-full text-red-500 hover:text-red-700">
                   <MdDelete size={25}/>
               </button>
          </div>
         )
      } 

    })
  ]

  //to delete sub category
  const handleDeleteSubCategory = async() => {
    try {
      const response = await Axios({
        ...SummaryAPI.deleteSubCategory,
        data : deleteSubCategoryData
      })
      const {data : responseData} = response
      if(responseData.success){
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategoryData({_id : ""})
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

 // console.log("subCategorydata", data)
  return (
    <section>
        <div className="p-4 bg-white shadow-md flex items-center justify-between">
            <h2 className="font-bold">Sub Category</h2>
            <button onClick={() =>SetOpenAddSubCategory(true)}
            className="text-sm font-semibold border border-secondary-200 hover:bg-secondary-200 px-3 py-1 rounded">
            Add Sub Category
            </button>
        </div>
        <div className="overflow-auto w-full max-w-[95vw]">
            <DisplayTable
              data = {data}
              column = {column}
            />
        </div>
        {
          openAddSubCategory && (
             <UploadSubCategoryModel  close = {() =>SetOpenAddSubCategory(false)} fetchData ={fetchSubCategory}/>
           
          )
        }
        { 
          ImageUrl && (
          <ViewImage url={ImageUrl} close={()=> setImageUrl("")}/>
          )
        }
        {
          openEdit && (
          <EditSubCategory data= {editData} fetchData={fetchSubCategory} close = {() => setOpenEdit(false)}/>
          )
        }
        {
          openDeleteConfirmBox && (
            <ConfirmBox
              close={() => setOpenDeleteConfirmBox(false)}
              cancel={() => setOpenDeleteConfirmBox(false)}
              confirm={handleDeleteSubCategory}
            />
          )
        }
    </section>
  )
}

export default SubCategoryPage