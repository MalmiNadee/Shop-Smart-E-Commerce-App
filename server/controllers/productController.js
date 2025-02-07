import ProductModel from './../models/productModel.js';

//upload the product
export const AddProductController = async(request, response) => {
   try {
      const { name, image, category, subCategory, unit, stock, price, discount,  description,  more_details } =request.body

      if(!name || !image[0] || !category[0] || !subCategory[0] || !unit || !stock || !price || !description ){
        return response.status(400).json({
            message : "Enter required fields",
            error : true,
            success : false
        })
    }

    //add new product in database
    const product = new ProductModel({
        name,
        image,
        category,
        subCategory,
        unit, 
        stock, 
        price, 
        discount,  
        description,  
        more_details
    })

    const saveProduct = await product.save()
    if(!saveProduct){
        return response.status(400).json({
            message: "Not Added Product",
            error : true,
            success : false
        })
    }

    return response.json({
        message : "Added Product Successfully",
        data : saveProduct,
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

//to get the product
export const GetProductController = async(request, response) => {
    try {
        let {page, limit, search} = request.body
        if(!page){
            page = 2
        }
        if(!limit){
            limit = 10
        }

        const query = search ? {
             $text : {
                $search : search
             }
        } : {}

        const skip = (page - 1) * limit
        const [data, totalCount] = await Promise.all([

            ProductModel.find(query).sort({createdAt : -1}).skip(skip).limit(limit).populate("category subCategory"), //get the product
            ProductModel.countDocuments(query) //get total no of product count
        ])

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            totalCount : totalCount,
            totalNoPages : Math.ceil(totalCount / limit),
            data : data
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error : true,
            success : false
        })
    }

}

//to get the product by category
export const getProductByCategory = async(request, response) => {
    try {
        const { id } = request.body

        if(!id){
            return response.status(400).json({
                message: "provide category id",
                error : true,
                success : false
            })  
        }
        const product = await ProductModel.find({
            category : {$in : id }
        }).limit(15)

        return response.json({  //status by default 200
            message: "Category Product List",
            data : product,
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

//to get the product by category and subcategory
export const getProductByCategoryAndSubCategory = async(request, response) => {
    try {
        const {categoryId, subCategoryId, page, limit } = request.body

        if(!categoryId || !subCategoryId ){
            return response.status(400).json({
                message: "Provide CategoryId and subCategoryId",
                error : true,
                success : false
            })  
        } 

        //add page number like pagination part
        if(!page){
            page = 2
        }

        if(!limit){
            limit = 10
        }
        //fetch data
        const query = {
            category :  {$in : categoryId},
            subCategory : {$in : subCategoryId}
        }
        const skip = (page - 1) * limit

        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)//get the count
        ])

        return response.json({  //status by default 200
            message: "Product List",
            data : data,
            totalCount : dataCount,
            page : page,
            limit : limit,
            success : true,
            error : false,
        }) 
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error : true,
            success : false
        }) 
    }

}

//to get the product details
export const getProductDetails = async(request, response) => {
    try {
        const { productId } = request.body
        const product = await ProductModel.findOne({ _id : productId })
       
        return response.json({  
            message: "Product Details",
            data : product,
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

//to update the product
export const UpdateProductController = async (request, response) => {
    try {
       const { _id } = request.body
       //check id user sent or not
       if(!_id){
         return response.status(400).json({
            message: "Provide product _id",
            error : true,
            success : false
        })
       }
        //check id availabe in db or not
        // 1 parameter id of product and 2 parameter which field to update
       const updateProduct = await ProductModel.updateOne({_id : _id}, {
        ...request.body
       })

       return response.json({
        message: "Product Updated Successfully",
        data : updateProduct,
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

//to delete the product
export const DeleteProductController = async (request, response) => {
    try {
        const { _id } = request.body
        //check user provide id or not
        if(!_id){
            return response.status(400).json({
                message: "Provide product _id",
                error : true,
                success : false
            })
        }
         //to delete product
         const deleteProduct = await ProductModel.deleteOne({_id : _id})

         return response.json({
           message: "Product Deleted Successfully.",
           data : deleteProduct,
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

//to search the product
export const SearchProductController = async (request, response) => {
    try {
        let { search, page, limit } = request.body

        if(!page){
            page = 1
        }
        if(!limit){
            limit = 10
        }
        const query = search ? {
            $text : {
                $search : search
            }
        } : {}

        const skip = (page - 1) * limit

        const [data, dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1}).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message: "Product Data",
            success : true,
            error : false,
            data : data,
            page : page,
            limit : limit,
            totalCount : dataCount,
            totalPage: dataCount > 0 ? Math.ceil(dataCount / limit) : 1, // Ensure at least 1 page
            
           
        })
        

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error : true,
            success : false
        })
    }
}


       




