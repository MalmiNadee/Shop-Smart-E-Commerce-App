import { Router } from "express";
import auth from "../middleware/auth.js";
import { AddSubCategoryController, DeleteSubCategoryController, GetSubCategoryController, UpdateSubCategoryController } 
from "../controllers/subCategoryController.js";

const subCategoryRouter = Router()

subCategoryRouter.post("/add", auth, AddSubCategoryController)
subCategoryRouter.post("/get", GetSubCategoryController)
subCategoryRouter.put("/update", auth, UpdateSubCategoryController)
subCategoryRouter.delete("/delete", auth, DeleteSubCategoryController)

export default subCategoryRouter