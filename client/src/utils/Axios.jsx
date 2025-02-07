import axios from 'axios';
import SummaryAPI, { baseURL } from './../common/SummaryAPI';


//custom axios
const Axios = axios.create({
    baseURL : baseURL,
    withCredentials : true //set cookies inside the client browser
})

//sending access token in the header
Axios.interceptors.request.use(
    async(config) => {
        const accessToken = localStorage.getItem('accessToken')
        // console.log("accessToken",accessToken)
        // if accessToken avaiable in local storage send to backend
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },(error)=> {
        return Promise.reject(error)
    }
)

//extend life span of access token with help of refresh token
Axios.interceptors.request.use(
    (response) => {
        return response
    },async (error)=> {
        let originRequest = error.config

        //check access token expired or not
        if(error.response.status === 401 && !originRequest.retry){
              originRequest.retry = true //because its by default false
              //get refresh toke
              const refreshToken = localStorage.getItem("refreshToken")
              //if refresh token available have to renew access token 
              if(refreshToken){
                 const newAccessToken = await refreshAccessToken(refreshToken)

                 //access token refresh again send response to backend
                   if(newAccessToken){
                      originRequest.headers.Authorization = `Bearer ${newAccessToken}`
                      return Axios(originRequest)
                   }
              }

        }

        return Promise.reject(error)

    }
)

const refreshAccessToken = async(refreshToken) =>{
    try {
        const response = await Axios({
            ...SummaryAPI.refreshToken,
            headers : {
                Authorization : `Bearer ${refreshToken}`
            }
        })
        const accessToken = response.data.data.accessToken
       // console.log(response)
       localStorage.setItem('accessToken',accessToken)
       return accessToken
    } catch (error) {
        console.log(error)
    }
}

export default Axios;
