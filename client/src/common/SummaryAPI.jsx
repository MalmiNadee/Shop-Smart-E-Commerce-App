/* eslint-disable react-refresh/only-export-components */
//all API endpoints available here
export const baseURL = import.meta.env.VITE_API_URL

const SummaryAPI = {
    // User Related APIs 
    register : {
        url : '/api/user/register', method : 'post'
    },
    login : {
        url : '/api/user/login', method : 'post'
    },
    forgot_password : {
        url : '/api/user/forgot-password', method : 'put'
    },
    forgot_password_otp_verification : {
        url : '/api/user/verify-forgot-password-otp', method : 'put'
    },
    reset_password : {
        url : '/api/user/reset-password', method : 'put'
    },
    refreshToken : {
        url : '/api/user/refresh-token', method : 'post'
    },
    userDetails : {
        url : '/api/user/user-details', method : 'get'
    },
    logout : {
        url : '/api/user/logout', method : 'get'
    },
    uploadAvatar : {
        url : '/api/user/upload-avatar', method : 'put'
    },
    updateUserDetails : {
        url : '/api/user/update-user', method : 'put'
    },
 
     // file upload Related APIs 
    uploadImage : {
        url : '/api/file/upload', method : 'post'
    },

     // Category Related APIs 
    addCategory : {
        url : '/api/category/add', method : 'post'
    },
    getCategory : {
        url : '/api/category/get', method : 'get'
    },
    updateCategory : {
        url : '/api/category/update', method : 'put'
    },
    deleteCategory : {
        url : '/api/category/delete', method : 'delete'
    },

     // Sub Category Related APIs 
    addSubCategory : {
        url : '/api/subcategory/add', method : 'post'
    },
    getSubCategory : {
        url : '/api/subcategory/get', method : 'post'
    },
    updateSubCategory : {
        url : '/api/subcategory/update', method : 'put'
    },
    deleteSubCategory : {
        url : '/api/subcategory/delete', method : 'delete'
    },

     // Product Related APIs 
    addProduct : {
        url : '/api/product/add', method : 'post'
    },
    getProduct : {
        url : '/api/product/get', method : 'post'
    },
    getProductByCategory : {
        url : '/api/product/get-product-by-category', method : 'post'
    },
    getProductByCategoryAndSubCategory : {
        url : '/api/product/get-product-by-category-and-subcategory', method : 'post'
    },
    getProductDetails : {
        url : '/api/product/get-product-details', method : 'post'
    },
    updateProductDetails : {
        url : '/api/product/update-product-details', method : 'put'
    },
    deleteProduct : {
        url : '/api/product/delete-product', method : 'delete'
    },
    searchProduct : {
        url : '/api/product/search-product', method : 'post'
    },

     // Cart Related APIs 
    addToCart : {
        url : '/api/cart/add', method : 'post'
    },
    getCartItem : {
        url : '/api/cart/get', method : 'get'
    },
    updateCartItemQty : {
        url : '/api/cart/update-qty', method : 'put'
    },
    deleteCartItem : {
        url : '/api/cart/delete-cart-item', method : 'delete'
    },

     // Address Related APIs 
    addAddress: {
        url : '/api/address/add', method : 'post'
    },
    getAddress: {
        url : '/api/address/get', method : 'get'
    },
    updateAddress : {
        url : '/api/address/update', method : 'put'
    },
    disableAddress : {
        url : '/api/address/disable', method : 'delete'
    },

    // Order Related APIs 
    cashOnDeliveryOrder : {
        url : '/api/order/cash-on-delivery', method : 'post'
    },
    payment_url :  {
        url : '/api/order/checkout', method : 'post'
    },
    getOrderItems :  {
        url : '/api/order/get-order-list', method : 'get'
    },
}

export default SummaryAPI
