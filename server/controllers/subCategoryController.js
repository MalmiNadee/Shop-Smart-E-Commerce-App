import SubCategoryModel from '../models/subCategoryModel.js';

//upload the subcategory
export const AddSubCategoryController = async(request, response) => {
   try {
     const {name, image, category} = request.body
   //   if(!name && !image && !category[0]){
   //      return response.status(400).json({
   //          message: "Provide required fields",
   //          error : true,
   //          success : false
   //      })
   //   }

   if (!name || !image || !category[0]) {
      return response.status(400).json({
        message: "Provide required fields",
        error: true,
        success: false,
      });
    }

     const payload = {
        name,
        image,
        category
     }

     const createSubCategory = new SubCategoryModel(payload)
     const saveSubCategory = await createSubCategory.save()

     if(!saveSubCategory){
      return response.status(400).json({
          message: "Not Added Sub Category",
          error : true,
          success : false
      })
  }

     return response.json({
      message : "Added Sub Category Successfully",
      data : saveSubCategory,
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

//to fetch subcategory data 
export const GetSubCategoryController = async(request, response) => {
   try {
      const data = await SubCategoryModel.find().sort({createdAt : -1}).populate('category')
      return response.json({
         message : "Sub Category Data",
         data : data,
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

//to update subcategory data 
export const UpdateSubCategoryController = async(request, response) => {
   try {
      const { _id, name, image, category } = request.body
      const checkSubCategory = await SubCategoryModel.findById(_id)
      if(!checkSubCategory){
         return response.status(400).json({
            message: "Check your sub category id",
            error : true,
            success : false
        })
      }

      //if id available in database
      const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id, {
         name,
         image,
         category
      })

      return response.json({
         message: "Sub Category Updated Successfully",
         data : updateSubCategory,
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

//to delete subcategory data 
export const DeleteSubCategoryController = async(request, response) => {
   try {
      const {_id} = request.body
      console.log("ID", _id)

       //if this sub category not use anywhere can delete
       const deletSubeCategory = await SubCategoryModel.findByIdAndDelete(_id)

       return response.json({
         message: "Sub Category Deleted Successfully.",
         data : deletSubeCategory,
         error : false,
         success : true
       })
   } catch (error) {
      return response.status(500).json({
         message: error.message || error,
         error : true,
         success : false
     })
   }
}


