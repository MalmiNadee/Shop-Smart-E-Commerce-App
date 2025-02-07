/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import CardLoading from './../components/CardLoading';
import SummaryAPI from '../common/SummaryAPI';
import Axios from './../utils/Axios';
import AxiosToastError from './../utils/AxiosToastError';
import CardProduct from './../components/CardProduct';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from "react-router-dom";
import noDataImage from '../assets/nothing here yet.webp'



const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const loadingArrayCard = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params = useLocation()
  const searchText = params?.search?.slice(3)



  const fetchData = async() => {
    try {
      setLoading(true)
      const response =await Axios({
        ...SummaryAPI.searchProduct,
        
        data : {
          search : searchText ,
          page : page   
        }
      })
     // console.log("totalPage"+totalPage)
      const {data : responseData} = response

      if(responseData.success){
        if(responseData.page == 1){
          setData(responseData.data)
        }else{
          setData((preve) => {
            return [
              ...preve,
              ...responseData.data
            ]
          })
        }
        setTotalPage(response.totalPage)
        //console.log(responseData)

      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect (()=> {
    fetchData()
  },[page,searchText])
 // console.log(page)

  const handleFetchMore = () => {
    if(totalPage > page){
      setPage(preve => preve + 1)
    }
  }
  

  return (
    <section className="bg-white">
      <div className="container mx-auto p-4">
        <p className="font-semibold">Search Results: {data.length}</p>
      </div>

      <InfiniteScroll dataLength={data.length} hasMore={true} next={handleFetchMore} >
      {/* use next for fetch products more */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-2">
       {
        data.map((p,index)=> {
          return (
            <CardProduct key={p?._id+index+"searchProduct"} data={p}/>
          )
        })
      }
      
       {/* loading data */}
       {
        loading && (
          loadingArrayCard.map((_,index)=> {
            return (
              <CardLoading key={index+"loadingSearchPage"}/>
            )
          })
        )
      }
     
      </div>
      </InfiniteScroll>

      {/*  no data image */}
      {
       !data[0] && !loading && (
        <div className="flex flex-col items-center justify-center w-fit mx-auto">
          <img src={noDataImage} className="w-full h-full max-w-xs max-h-xs block"/>
          <p className="font-semibold my-2">No Data Found</p>
        </div>
       )
      }
     
    </section>
  )
}

export default SearchPage