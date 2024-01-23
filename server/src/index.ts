import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { userRouter } from './routes/user'

dotenv.config()

const PORT: number = Number(process.env.PORT);
const databaseURL: string = process.env.DATABASE_URL 
const app=express();

app.use(express.json()) // convert all the data coming towards server into JSON format
app.use(cors()) // Cross Origin Resource Sharing
app.use("/user",userRouter)  // makes the call to the http://localhost:3000/user/...

mongoose.connect(databaseURL);

app.listen(PORT ,() => {
    console.log(`server started!!! ${PORT}`)
})