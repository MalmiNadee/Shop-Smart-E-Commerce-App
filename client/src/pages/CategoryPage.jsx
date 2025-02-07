import { useEffect, useState } from "react"
import UploadCategoryModel from "../components/UploadCategoryModel.jsx"
import LoadingSpinner from "../components/LoadingSpinner.jsx"
import AxiosToastError from "../utils/AxiosToastError"
import NoData from "../components/NoData.jsx"
import Axios from "../utils/Axios.jsx"
import SummaryAPI from "../common/SummaryAPI.jsx"
import EditCategory from "../components/EditCategory.jsx"
import ConfirmBox from "../components/ConfirmBox.jsx"
import toast from "react-hot-toast"


const CategoryPage = () => {

    const [openUploadCategory, setOpenUploadCategory] = useState(false)
    const [loading, setLoading ] = useState(false)
    const [categoryData, setCategoryData ] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({
        name : "",
        image : "",
    })
    const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategoryData, setDeleteCategoryData] = useState({
        _id : ""
    })

    // const allCategory = useSelector(state => state.product.allCategory)

    // useEffect(() => {
    //     setCategoryData(allCategory)
    // },[allCategory])

    // console.log("allCategory redux", allCategory)

    const fetchCategory = async() => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryAPI.getCategory
            })
            const {data : responseData} = response
            if(responseData.success){
                setCategoryData(responseData.data)
            }
            console.log(responseData)
        } catch (error) {
            AxiosToastError(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
       fetchCategory()
    },[])

    const handleDeleteCategory = async() => {
       try {
        const response = await Axios({
            ...SummaryAPI.deleteCategory,
            data : deleteCategoryData
        })
        
        const {data : responseData} = response
        if(responseData.success){
            toast.success(responseData.message)
            fetchCategory()
            setOpenConfirmBoxDelete(false)
        }
       } catch (error) {
        AxiosToastError(error)
       }
    }

   // console.log("categoryData", categoryData)
  return (
    <section>
        <div className="p-4 bg-white shadow-md flex items-center justify-between">
            <h2 className="font-bold">Category</h2>
            <button onClick={() => setOpenUploadCategory(true)} 
            className="text-sm font-semibold border border-secondary-200 hover:bg-secondary-200 px-3 py-1 rounded">
            Add Category
            </button>
        </div>
        {
            !categoryData[0] && !loading && (
                <NoData/>
            )
        }
  {/* if category data available */}
     <div className="p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 gap-y-6">
        {
         categoryData.map((category, index) => {
           return (
            <div key={category._id || index} className="w-40 h-60 group rounded shadow-md">
           
                <img alt={category.name} src={category.image} className="w-full h-36 object-cover rounded-t" />
                  {/* Display the category name */}
                <p className="text-sm font-medium text-center mt-3 text-black">{category.name}</p>
                <div className="items-center h-9 flex gap-2 mt-3">
                    <button onClick={() => {setOpenEdit(true), setEditData(category)} }
                     className="flex-1 bg-green-400 hover:bg-green-600 font-medium text-black rounded py-1">Edit</button>
                    <button onClick={() => {setOpenConfirmBoxDelete(true), setDeleteCategoryData(category)}}
                    className="flex-1 bg-red-400 hover:bg-red-600 font-medium text-black rounded py-1">Delete</button>
                </div>
            </div>
        )
    })
    }
        </div>

        {
            loading &&  (
                <LoadingSpinner/>
            )
        }
        {
            openUploadCategory && (
                <UploadCategoryModel fetchData ={fetchCategory} close= {() => setOpenUploadCategory(false)}/>
            )
        }
        {
            openEdit && (
                <EditCategory data={editData} fetchData ={fetchCategory} close= {() => setOpenEdit(false)}/>
            )
        }
        {
             openConfirmBoxDelete && (
             <ConfirmBox 
               close={() => setOpenConfirmBoxDelete(false)}
               cancel={() => setOpenConfirmBoxDelete(false)}
               confirm={handleDeleteCategory}
             />
            )
        }


        
    </section>
  )
}

export default CategoryPage