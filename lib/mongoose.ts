import mongoose from 'mongoose'

let isConnected: boolean = false

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', true)

  if (!process.env.DATABASE_URL) {
    return console.log('Missing MONGODB URL')
  }

  if (isConnected) {
    return console.log('MongoDB is Already connected')
  }
  try {
    await mongoose.connect(process.env.DATABASE_URL, {})
    isConnected = true

    console.log('MongoDB is connected')
  } catch (error) {
    console.log('MongoDB connection failed', error)
  }
}
