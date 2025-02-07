import { Router } from "express";
import auth from './../middleware/auth.js';
import { CashOnDeliveryOrderController, GetOrderDetailsController, 
        PaymentController, WebhookStripe } from "../controllers/orderController.js";


const orderRouter = Router()

orderRouter.post('/cash-on-delivery', auth, CashOnDeliveryOrderController);
orderRouter.post('/checkout', auth, PaymentController);
orderRouter.post('/webhook', WebhookStripe);
orderRouter.get('/get-order-list', auth, GetOrderDetailsController);

export default orderRouter
