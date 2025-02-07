import OrderModel from './../models/orderModel.js';
import UserModel from '../models/userModel.js';
import mongoose from 'mongoose';
import CartProductModel from './../models/cartProductModel.js';
import Stripe from "../config/stripe.js";



//to cash on delivery order
export async function CashOnDeliveryOrderController(request,response) {
    try {
        const userId =  request.userId
        const { item_list, totalAmount, addressID, subTotalAmount } =request.body

        //    Check if addressID is provided
        //   if (!addressID) {
        //     return response.status(400).json({
        //         message: "Delivery address is required.",
        //         error: true,
        //         success: false
        //     });
        // }

        // console.log("item_list",item_list)
        // console.log("totalAmount",totalAmount)
        // console.log("addressID",addressID)
        // console.log("subTotalAmount",subTotalAmount)

        const payload = item_list.map(el => {
            return ({
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`, //generate unique object id
                productId : el.productId._id,
                product_details : {
                    name : el.productId.name,
                    image : el.productId.image,
                },
                paymentId : "",
                payment_status : "CASH ON DELIVERY",
                delivery_address : addressID,
                subTotalAmount : subTotalAmount,
                totalAmount : totalAmount,
                 
            })
        })
        //insert data into db
        const generatedOrder = await OrderModel.insertMany(payload)

        //after order inserted order remove from user cart
        const removeCartItems = await CartProductModel.deleteMany({ userId : userId})
        const updateInUser = await UserModel.updateOne({ _id : userId }, {shopping_cart : [] })

        

        return response.json({
            message : "Order Added Successfully",
            data : generatedOrder,
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

//item price with discount
export const PriceWithDiscount = (price, discount=1) => { //discount not provide or 0 by default its 1
    const discountAmount = Math.ceil((Number(price) * Number(discount)) / 100)
    const actualPrice = Number(price) - Number(discountAmount)
    return actualPrice
 }

//to payment using stripe
export async function PaymentController(request,response) {
    try {
        const userId =  request.userId
        const { item_list, totalAmount, addressID, subTotalAmount } =request.body
       

        const user = await UserModel.findById(userId)

        const line_items = item_list.map(item => {
            return {
                price_data : {
                    currency : 'LKR',
                    product_data : {
                        name : item.productId.name,
                        images : item.productId.image,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount : PriceWithDiscount(item.productId.price, item.productId.discount) * 100 // Stripe requires amount in cents
                },
                adjustable_quantity : {
                    enabled : true,
                    minimum : 1
                },
                quantity : item.quantity
            }
        })

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressID : addressID
            },
            line_items : line_items,
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return response.status(200).json(session) //303 to redirect to another page

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }

}

//get all product data
const getOrderProductItems = async({ lineItems, userId, addressId, paymentId, payment_status }) =>{
   const productList = [] //insert all products
   //check data coming or not
   if(lineItems?.data?.length){
      for(const item of lineItems.data){
         const product = await Stripe.products.retrieve(item.price.product) //get product details
        // console.log("product",product)
         const payload =  {
            userId : userId,
            orderId : `ORD-${new mongoose.Types.ObjectId()}`, //generate unique object id
            productId : product.metadata.productId,
            product_details : {
                name : product.name,
                image : product.image,
            },
            paymentId : paymentId,
            payment_status :  payment_status,
            delivery_address : addressId,
            subTotalAmount :  Number(item.amount_total / 100),
            totalAmount : Number(item.amount_total / 100),
         }
         productList.push(payload)
      }
   }

   return productList
}

//http://localhost:8081/api/order/webhook
//Webhooks in Stripe notify your server about payment events in real time.
export async function WebhookStripe(request,response){
    const event = request.body;
    const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY

    console.log("event",event)

     // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':  //payment data coming
      const session = event.data.object;
       //extract data 
      const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
      const userId = session.metadata.userId
      const orderProduct = await getOrderProductItems(
        {
            lineItems : lineItems,
            userId : userId,
            addressId : session.metadata.addressId,
            paymentId  : session.payment_intent,
            payment_status : session.payment_status,
        })   //get all orderlist details
    
      const order = await OrderModel.insertMany(orderProduct)

        console.log(order)
        if(Boolean(order[0])){
            const removeCartItems = await  UserModel.findByIdAndUpdate(userId,{
                shopping_cart : []
            })
            const removeCartProductDB = await CartProductModel.deleteMany({ userId : userId})
        }
      break;
      default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
}

//to get all order details
export async function GetOrderDetailsController(request,response){
    try {
        const userId = request.userId //order id

        const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1}).populate("delivery_address")
             // populate used to fetch the referenced document from another collection in MongoDB.

        return response.json({
            message : "Order List",
            data : orderlist,
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




  
  





