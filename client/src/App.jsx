/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast';
import { useEffect,useCallback } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllCategory, setAllSubCategory,setLoadingCategory } from './store/productSlice';
import { useDispatch } from 'react-redux';
import SummaryAPI from './common/SummaryAPI';
import Axios from './utils/Axios';
import AxiosToastError from './utils/AxiosToastError';
import GlobalProvider from './provider/GlobalProvider';
import CartMobileLink from './components/CartMobileLink';


function App() {

  const dispatch = useDispatch()
  const location = useLocation()
  

  //check user already login or not
  const fetchUser = useCallback(async() => {
    const userData = await fetchUserDetails()
   // console.log("userData",userData.data)
    dispatch(setUserDetails(userData.data))
  },[dispatch])

 //get all category details 
  const fetchCategory = async() => {
    try {
        dispatch(setLoadingCategory(true))
        const response = await Axios({
            ...SummaryAPI.getCategory
        })
        const {data : responseData} = response
        if(responseData.success){
          dispatch(setAllCategory(responseData.data))
           // setCategoryData(responseData.data)
        }
    //    console.log(responseData)
    } catch (error) {
        AxiosToastError(error)
    } finally {
      dispatch(setLoadingCategory(false))
    }
}

//get all subcategory details 
const fetchSubCategory = async() => {
  try {
     
      const response = await Axios({
          ...SummaryAPI.getSubCategory
      })
      const {data : responseData} = response
      if(responseData.success){
        dispatch(setAllSubCategory(responseData.data))
         // setCategoryData(responseData.data)
      }
   //   console.log(responseData)
  } catch (error) {
      AxiosToastError(error)
  }
}



  //only call single time
  useEffect(()=> {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
    // fetchCartItem()
  },[])

 // console.log("location",location)

  return (
     <GlobalProvider>
       <Header/>
    <main className="container mx-auto min-h-[78vh]">
      <Outlet/>
    </main>
    <Footer/>
    <Toaster/>
    {
      location.pathname !== '/checkout' && (
        <CartMobileLink/>
      )
    }
    </GlobalProvider>
  )
}

export default App
