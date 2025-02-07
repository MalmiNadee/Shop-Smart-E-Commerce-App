import CategoryModel from './../models/categoryModel.js';
import SubCategoryModel from './../models/subCategoryModel.js';
import ProductModel from './../models/productModel.js';

//upload the category
export const AddCategoryController = async (request, response) => {
    try {
        const {name, image} = request.body

        if(!name || !image){
            return response.status(400).json({
                message : "Enter required fields",
                error : true,
                success : false
            })
        }

        //create new category
        const addCategory = new CategoryModel({
            name,
            image
        })

        const saveCategory = await addCategory.save()

        if(!saveCategory){
            return response.status(400).json({
                message: "Not Added Category",
                error : true,
                success : false
            })
        }

        return response.json({
            message : "Added Category Successfully",
            data : saveCategory,
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

//to get the category
export const GetCategoryController = async (request, response) => {
    try {
        const data = await CategoryModel.find().sort({createdAt : -1})

        return response.json({
            data : data,
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

//to update the category
export const UpdateCategoryController = async (request, response) => {
    try {
       const {_id, name, image } = request.body //need id for update category

       const update = await CategoryModel.updateOne({
            _id : _id
       }, {
        name,
        image 
       })

       return response.json({
        message: "Updated Category Successfully",
        success : true,
        error : false,
        data : update
    })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error : true,
            success : false
        })
        
    }
}

//to delete the category
export const DeleteCategoryController = async (request, response) => {

    try {
        const { _id } = request.body

        const checkSubCategory = await SubCategoryModel.find({
            category : {
                "$in" : {_id} //MongoDB checks if a field's value matches any value in a given array. 
                // It filters documents based on multiple possible values. if this available return true

            }
        }).countDocuments() //if >0 then category is used

        const checkProduct = await ProductModel.find({
            category : {
                "$in" : {_id}
            }
        }).countDocuments()
        
        //category will not deleted because category use there
        if(checkSubCategory > 0 || checkProduct > 0){
            return response.status(400).json({
                message: "Deletion failed: The Category is currently in use and cannot be deleted.",
                error : true,
                success : false
            })
        }

        //if this category not use anywhere can delete
        const deleteCategory = await CategoryModel.deleteOne({_id : _id})

          return response.json({
            message: "Category Deleted Successfully.",
            data : deleteCategory,
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