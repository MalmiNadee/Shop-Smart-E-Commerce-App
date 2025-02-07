import AddressModel from "../models/addressModel.js";
import UserModel from "../models/userModel.js";

//to add the address
export const addAddressController = async(request, response) => {
    try {
       const userId = request.userId  //middleware
       const { address_line, city, state, pincode, country, phone  } = request.body

       const createAddress = new AddressModel({
            address_line, 
            city, 
            state, 
            pincode, 
            country, 
            phone,
            userId : userId,
       })

       const saveAddress = await createAddress.save()

       const addUserAddressId = await UserModel.findByIdAndUpdate(userId, {
        $push : {
            address_details : saveAddress._id
        }
       })

       return response.json({
        message : "Address Added Successfully",
        data : saveAddress,
        success : true,
        error : false
    })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//to get the address
export const getAddressController = async(request, response) => {
    try {
        const userId = request.userId // auth middleware check user already login

        const data = await AddressModel.find({ userId : userId }).sort({ createdAt : -1})

        return response.json({
            message : "List of Addresses",
            data : data,
            success : true,
            error : false
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//to update the address
export const updateAddressController = async(request, response) => {
    try {
        const userId = request.userId //auth middleware
        const { _id, address_line, city, state, pincode, country, phone} = request.body

        const updateAddress = await AddressModel.updateOne({ _id : _id, userId : userId }, {
            address_line,
            city,
            state,
            pincode,
            country,
            phone
        })

        return response.json({
            message: "Address Updated Successfully",
            data : updateAddress,
            success : true,
            error : false
        })
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error : true,
            success : false
        })
    }
}

//to disable the address
export const deleteAddressController = async(request, response) => {
    try {
        const userId = request.userId
        const { _id } = request.body

        const disableAddress = await AddressModel.updateOne({ _id : _id, userId }, { status : false })

        return response.json({
            message: "Address Removed",
            data : disableAddress,
            success : true,
            error : false
        })
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error : true,
            success : false
        })
    }
}