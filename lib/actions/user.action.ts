'use server'

import User from '@/database/user.model'
import { FilterQuery } from 'mongoose'
import { connectToDatabase } from '../mongoose'
import {
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
} from './shared.types'
import { revalidatePath } from 'next/cache'
import Tag from '@/database/tag.model'
import Question from '@/database/question.model'
import Answer from '@/database/answer.model'

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
export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase()

    const { userId } = params

    const user = await User.findOne({ userId })

    if (!user) return

    const totalQuestions = await Question.countDocuments({ author: user._id })
    const totalAnswers = await Answer.countDocuments({ author: user._id })

    return { user, totalAnswers, totalQuestions }
  } catch (error) {
    console.log(error)

    throw error
  }
}
export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase()

    const { userId, page = 1, pageSize = 10 } = params

    const totalQuestions = await Question.countDocuments({
      author: userId,
    })

    const userQuestions = await Question.find({
      author: userId,
    })
      .sort({ views: -1, upvotes: -1 })
      .populate('tags', '_id name')
      .populate('author', '_id userId name picture')

    return { questions: userQuestions, totalQuestions }
  } catch (error) {
    console.log(error)

    throw error
  }
}
export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase()

    const { userId, page = 1, pageSize = 10 } = params

    const totalAnswers = await Answer.countDocuments({
      author: userId,
    })

    const userAnswers = await Answer.find({
      author: userId,
    })
      .sort({ upvotes: -1 })
      .populate('question', '_id title')
      .populate('author', '_id userId name picture')

    return { answers: userAnswers, totalAnswers }
  } catch (error) {
    console.log(error)

    throw error
  }
}
