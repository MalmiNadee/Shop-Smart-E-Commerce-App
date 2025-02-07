/* eslint-disable react/prop-types */
import { useState } from "react";
import EditProductAdmin from "./EditProductAdmin";
import { IoClose } from "react-icons/io5";
import AxiosToastError from "../utils/AxiosToastError";
import SummaryAPI from "../common/SummaryAPI";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDeleteCancel = () => {
    setOpenDelete(false)
  }

  const handleDelete = async() => {
    try {
      const response = await Axios({
        ...SummaryAPI.deleteProduct,
        data : {
          _id : data._id
        }
      })
      const {data : responseData} = response
      if(responseData.success){
        toast.success(responseData.message)
        if(fetchProductData){  //remove product from frontend
          fetchProductData()
        }
        setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }


  return (
    <div className="w-36 p-2 bg-white rounded">
      <div>
        <img
          src={data?.image[0]}
          alt={data.name}
          className="w-full h-full object-scale-down" // object-scale-down automatically image size adjust at card box
        />
      </div>
      <p className="text-ellipsis line-clamp-2 font-medium">{data?.name}</p>
      <p className="text-slate-400">{data?.unit}</p>
      <div className="grid grid-cols-2 gap-3 py-2">
        <button onClick={() => setEditOpen(true)}  className="border px-1 py-1 text-sm
         border-green-600 bg-green-200 text-green-800 hover:bg-green-400"> Edit </button>

        <button onClick={() => setOpenDelete(true)} className="border px-1 py-1 text-sm
         border-red-600 bg-red-200 text-red-800 hover:bg-red-400"> Delete  </button>
      </div>

      {
        editOpen && (
        <EditProductAdmin data={data} fetchProductData={fetchProductData} close={() => setEditOpen(false)} />
      )
      }

      {
        openDelete && (
        <section className="fixed top-0 bottom-0 left-0 right-0 z-50 bg-neutral-800 bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-white p-4 w-full max-w-md rounded-md">
            <div className="flex items-center justify-between">
              <h1 className="font-semibold">Permanent Delete</h1>
              <button className="ml-auto" onClick={() => setOpenDelete(false)}>
                <IoClose size={25} />
              </button>
            </div>
            <p className="my-4 text-gray-700">
              Are you sure you want to delete permanent ?
            </p>
            <div className="w-full flex items-center justify-end gap-5 py-4">
              <button onClick={handleDeleteCancel}
                className="px-3 py-1 border rounded border-red-500 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white">                   
                Cancel </button>
              <button onClick={handleDelete}
                className="px-3 py-1 border rounded border-green-500 bg-green-100 text-green-500 hover:bg-green-500 hover:text-white">           
                Delete </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductCardAdmin;
