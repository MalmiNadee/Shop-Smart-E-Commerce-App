/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { validateURLConvert } from "../utils/validateURLConvert";
import { PriceWithDiscount } from "../utils/PriceWithDiscount";
import { useState } from "react";
import AddToCartButton from "./AddToCartButton";

const CardProduct = ({ data }) => {
  const url = `/product/${validateURLConvert(data.name)}-${data._id}`
  const [loading, setLoading ] = useState(false)
 

  return (
    <Link to={url}
      className="border py-2 grid gap-2 lg:gap-4 max-w-48 lg:max-w-72 lg:min-w-64 rounded cursor-pointer bg-white">
      {/* Product Image */}
      <div className="min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden">
        {data.image?.[0] && (
          <img
            src={data.image[0]}
            alt={data.name}
            className="w-full h-full object-scale-down scale-125"
          />
        )}
      </div>

      {/* Delivery Time Badge and discount value */}
      <div className="flex items-center gap-2 justify-between">
        <div className="rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-100"> 10 Min  </div>  
        <div>
       {
          Boolean(data.discount) && (
            <p className="text-green-600 bg-green-100 px-2 w-fit text-sm rounded">{data.discount}% discount</p>
      )}    
        </div>
      </div>

      {/* Product Name */}
       <div className="px-2 lg:px-2 font-medium text-ellipsis text-sm lg:text-base line-clamp-2">
       {data.name}
      </div>


      {/* Product Unit */}
      <div className="px-2 lg:px-4 text-sm lg:text-base bg-blue-100 rounded w-fit">
        {data.unit} 
      </div>

      {/* Price and Add Button */}
      <div className="px-2 lg:px-3 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base">
        <div className="flex items-center gap-1">
        <div className="font-semibold text-sm">
            {DisplayPriceInRupees(PriceWithDiscount(data.price, data.discount))}
        </div>
       
        
        </div>
        <div >
          {
            data.stock == 0 ? (
              <p className="text-red-500 text-sm text-center">Out of Stock</p>
            ) : (
              <AddToCartButton data={data}/>
            )
          }
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
