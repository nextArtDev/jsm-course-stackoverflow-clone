'use server'

import User from '@/database/user.model'
import { FilterQuery } from 'mongoose'
import { connectToDatabase } from '../mongoose'
import {
  GetAllUsersParams,
  GetSavedQuestionsParams,
  ToggleSaveQuestionParams,
} from './shared.types'
import { revalidatePath } from 'next/cache'
import Tag from '@/database/tag.model'
import Question from '@/database/question.model'

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
export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase()

    const { userId, questionId, path } = params

    const user = await User.findById({ userId })

    if (!user) {
      throw new Error('User not found')
    }

    const isQuestionSaved = user.saved.includes(questionId)

    if (isQuestionSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      )
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      )
    }

    revalidatePath(path)
  } catch (error) {
    console.log(error)

    throw error
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase()

    const { userId, page = 1, pageSize = 10, filter, searchQuery } = params

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : {}

    const user = await User.findOne({ userId }).populate({
      path: 'saved',
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id userId name picture' },
      ],
    })

    // if (!user) throw new Error('User not found')
    if (!user) return

    const savedQuestions = user.saved

    return { questions: savedQuestions }
  } catch (error) {
    console.log(error)

    throw error
  }
}
