import CartProductModel from '../models/cartProductModel.js';
import UserModel from './../models/userModel.js';

//to items add to cart
export const AddToCartItemController = async(request, response) => {
    try {
        const userId = request.userId
        const { productId } = request.body

        if(!productId){
            return response.status(400).json({
                message : "Provide Product Id",
                error : true,
                success : false
            })
        }

        //check item already added to cart
        const checkItemCart = await CartProductModel.findOne({
            userId : userId,
            productId : productId
        })

        if(checkItemCart){
            return response.status(400).json({
                message : "Item Already in Cart"
            })
        }

        //create new cart
        const cartItem = new CartProductModel ({
            quantity : 1,
            userId : userId,
            productId : productId
        })

        const saveCartItem = await cartItem.save()
        
        //update inside user shopping_cart
        const updateUser = await UserModel.updateOne({_id : userId}, {
            $push : {
                shopping_cart : productId
            }
        })

        if(!saveCartItem){
            return response.status(400).json({
                message: "Not Added Cart",
                error : true,
                success : false
            })
        }

        return response.json({
            message : "Item Added to Cart",
            data : saveCartItem,
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

//to get items from cart
export const GetCartItemController = async(request, response) => {
    try {
        const userId = request.userId

        const cartItem = await CartProductModel.find({
            userId : userId
        }).populate('productId')

        return response.json({
            message : "Cart Item",
            data : cartItem,
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

//to update items from cart
export const UpdateCartItemQtyController = async(request, response) => {
    try {
        const userId  = request.userId //only can update logged user
        const { _id, qty } = request.body

         // Validation for _id and qty
         if(!_id || !qty || qty <= 0){
            return response.status(400).json({
                message : "Provide required _id and valid Quantity (greater than 0)",
                error : true,
                success : false
            });
        }

        // Check if the cart item exists
        const cartItem = await CartProductModel.findOne({ _id: _id, userId: userId });
        if (!cartItem) {
            return response.status(404).json({
                message: "Cart item not found",
                error: true,
                success: false
            });
        }
        
        // Update the cart item quantity
        const updateCartItem = await CartProductModel.updateOne(
            { _id: _id, userId: userId },
            { $set: { quantity: qty } }
        );

        return response.json({
            message: "Cart Item Updated",
            data: updateCartItem,
            success: true,
            error: false
        });
        
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
            
        })     
    }
}

//to delete items from cart
export const DeleteCartItemController = async(request, response) => {
    try {
        const  userId  = request.userId //middleware
        const { _id } = request.body

        if(!_id ){
            return response.status(400).json({
                message : "Provide required _id ",
                error : true,
                success : false
                
            }) 
        }

        const deleteCartItem = await CartProductModel.deleteOne({ _id : _id, userId: userId })

        return response.json({
            message: "Item removed",
            data : deleteCartItem,
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