import { createSlice } from '@reduxjs/toolkit';

const initialValue = {
    allCategory : [],
    loadingCategory : false,
    allSubCategory : [],
    product : [],
}

const productSlice = createSlice({
    name : 'product',
    initialState : initialValue,
    reducers : {
        setAllCategory : (state, action) => {
           // console.log("allCategory redux store", action.payload)
           state.allCategory = [...action.payload] // Update as an array
        },
        setLoadingCategory : (state, action) => {
            state.loadingCategory = action.payload
        },
        setAllSubCategory : (state, action) => {
            state.allSubCategory = [...action.payload] // Update as an array
         }
    }
})

export const {setAllCategory, setAllSubCategory, setLoadingCategory} = productSlice.actions

export default productSlice.reducer

