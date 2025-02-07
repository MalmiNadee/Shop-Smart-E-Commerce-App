import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddCategoryController, DeleteCategoryController,
     GetCategoryController, UpdateCategoryController } from "../controllers/categoryController.js";

const categoryRouter = Router()

categoryRouter.post("/add", auth, AddCategoryController)
categoryRouter.get("/get", GetCategoryController)
categoryRouter.put("/update", auth, UpdateCategoryController)
categoryRouter.delete("/delete", auth, DeleteCategoryController)

export default categoryRouter