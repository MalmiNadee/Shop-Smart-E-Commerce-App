import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddToCartItemController, GetCartItemController,
    UpdateCartItemQtyController, DeleteCartItemController} from "../controllers/cartController.js";

const cartRouter = Router()

cartRouter.post("/add", auth, AddToCartItemController)
cartRouter.get("/get", auth, GetCartItemController)
cartRouter.put("/update-qty", auth, UpdateCartItemQtyController)
cartRouter.delete("/delete-cart-item", auth, DeleteCartItemController)

export default cartRouter