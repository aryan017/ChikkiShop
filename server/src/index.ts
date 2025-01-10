import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { userRouter } from './routes/user'
import { productRouter } from './routes/product'
//import {addIpToAtlas} from './addIP_to_MongoDB'

dotenv.config()

const PORT: number = 10000 ;
const databaseURL: string = process.env.DATABASE_URL 
const app=express();

app.use(express.json()) // convert all the data coming towards server into JSON format
app.use(cors()) // Cross Origin Resource Sharing
app.use("/user",userRouter)  // makes the call to the http://localhost:3000/user/...
app.use("/product",productRouter)

//addIpToAtlas()

mongoose.connect(databaseURL);

app.listen(PORT ,'0.0.0.0',() => {
    console.log(`server started!!! ${PORT}`)
})