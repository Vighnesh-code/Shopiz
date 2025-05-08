import mongoose from "mongoose"

export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connection Successful: ${conn.connection.host}`)   
    } catch (error) {
        console.log(`Failed to connect to the database: ${error.message}`)
    }
}

