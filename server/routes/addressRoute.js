import { Router } from "express";
import auth from "../middleware/auth.js";
import { addAddressController, getAddressController, 
        updateAddressController, deleteAddressController } from "../controllers/addressController.js";

const addressRouter = Router()

addressRouter.post("/add",auth, addAddressController);
addressRouter.get("/get",auth, getAddressController);
addressRouter.put("/update",auth, updateAddressController);
addressRouter.delete("/disable",auth, deleteAddressController);


export default addressRouter