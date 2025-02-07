//setup
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './routes/userRoute.js'
import categoryRouter from './routes/categoryRoute.js'
import uploadRouter from './routes/uploadRoute.js'
import subCategoryRouter from './routes/subCategoryRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import addressRouter from './routes/addressRoute.js'
import orderRouter from './routes/orderRoute.js'


const app = express()
//add middleware
app.use(cors({
    credentials : true, //able to access client side cookies
    origin : process.env.FRONTEND_URL
}))

//RESPONSE CONVERT TO JSON format
app.use(express.json())
app.use(cookieParser())
app.use(morgan('combined'))
app.use(helmet({
    crossOriginResourcePolicy : false  //frontend and backend use in diff domain it show the error
}))

//add routes for check our server running or not in browser
app.get("/", (request, response)=> {
    //send data to server to client side
    response.json({
        message : "Server is running in " + PORT
    })
 })

app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/file', uploadRouter)
app.use('/api/subcategory', subCategoryRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)



 
const PORT = 8081 || process.env.PORT  //if 8080 port busy take other port
//check db connect or not
connectDB().then(()=> {
    app.listen(PORT , ()=> {
        console.log("Server is running in ", PORT)
    })
    
})


