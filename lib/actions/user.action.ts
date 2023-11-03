'use server'

import User from '@/database/user.model'
import { connectToDatabase } from '../mongoose'
import { GetAllUsersParams } from './shared.types'

export async function getUserByID(params: any) {
  try {
    connectToDatabase()

    const { userId } = params

    const user = await User.findOne({ userId })

    return user
  } catch (error) {
    console.log(error)

    throw error
  }
}
export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase()

    // const { page = 1, pageSize = 20, filter, searchQuery } = params

    const users = await User.find({}).sort({ createdAt: -1 })
    return { users }
  } catch (error) {
    console.log(error)

    throw error
  }
}
// export async function getUserByID(params: any) {
//   try {
//     connectToDatabase()

//     const { userId } = params

//     const user = await User.findOne({ userId })

//     return user
//   } catch (error) {
//     console.log(error)

//     throw error
//   }
// }
