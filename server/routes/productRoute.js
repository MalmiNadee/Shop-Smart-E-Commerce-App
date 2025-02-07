import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddProductController, getProductByCategory, UpdateProductController, DeleteProductController,
    getProductByCategoryAndSubCategory, GetProductController,getProductDetails,
    SearchProductController} from "../controllers/productController.js";
import { Admin } from "../middleware/Admin.js";


const productRouter = Router()

productRouter.post("/add", auth,Admin, AddProductController)
productRouter.post("/get", GetProductController) //post because need page no and limit from frontend
productRouter.post("/get-product-by-category", getProductByCategory) //post because need to pass category id
productRouter.post("/get-product-by-category-and-subcategory", getProductByCategoryAndSubCategory) //post because need to pass category and subcategory id
productRouter.post("/get-product-details", getProductDetails)
productRouter.put("/update-product-details", auth, Admin, UpdateProductController)  //admin able to create , update, delete product
productRouter.delete("/delete-product", auth, Admin, DeleteProductController)
productRouter.post("/search-product", SearchProductController)

export default productRouter