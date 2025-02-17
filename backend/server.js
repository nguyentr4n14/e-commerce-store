import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

// Routes
import authRoutes from './routes/auth.route.js'
import productRoutes from './routes/product.route.js'

// Database
import { connectDb } from './lib/db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json()) // Parse req.body
app.use(cookieParser()) // Parse req.cookie

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    connectDb()
})
