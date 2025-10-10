import express from "express"
import "dotenv/config"
import { connectDB } from "./database"
import cors from "cors"

const app = express()
const port = process.env.PORT_NUMBER 

//app config
app.use(express.json({limit:"16kb", strict: false}))
app.use(cors({
    origin:"http://localhost:5173"
}))

//routes
import urlRegister from "./routes/url.register"
import urlRedirect from "./routes/redirect.route"

app.use("/api/url",urlRegister)
app.use("/",urlRedirect)

//server setup 
connectDB().then(()=>{
    app.listen(port,()=>{
        console.log("Data base connected")
        console.log(`server is running on http://localhost:${port}`)
    })
})
.catch(()=>{
    console.log("failed to start the server")
    process.exit(1)
})