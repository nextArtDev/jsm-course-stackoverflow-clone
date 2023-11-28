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
  UpdateUserParams,
} from './shared.types'
import { revalidatePath } from 'next/cache'
import Tag from '@/database/tag.model'
import Question from '@/database/question.model'
import Answer from '@/database/answer.model'
import { BadgeCriteriaType } from '@/types'
import { assignBadges } from '../utils'
import { prisma } from '../prisma'

export async function getUserByID(params: any) {
  try {
    // connectToDatabase()

    const { userId } = params

    // const user = await User.findOne({ userId })

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    return user
  } catch (error) {
    console.log(error)

    throw error
  }
}
export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase()

    const { page = 1, pageSize = 20, filter, searchQuery } = params
    const skipAmount = (page - 1) * pageSize

    let sortOptions = {}

    switch (filter) {
      case 'new_users':
        sortOptions = { joinedAt: -1 }
        break
      case 'old_users':
        sortOptions = { joinedAt: 1 }
        break
      case 'top_contributors':
        sortOptions = { reputation: -1 }
        break
      // case 'recommended':
      //   break

      default:
        break
    }

    const query: FilterQuery<typeof User> = {}

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { username: { $regex: new RegExp(searchQuery, 'i') } },
      ]
    }

    const users = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions)

    const totalUsers = await Question.countDocuments(query)

    const isNext = totalUsers > skipAmount + users.length

    return { users, isNext }
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
    const skipAmount = (page - 1) * pageSize

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, 'i') } }
      : {}

    let sortOptions = {}

    switch (filter) {
      case 'most_recent':
        sortOptions = { createdAt: -1 }
        break
      case 'oldest':
        sortOptions = { createdAt: 1 }
        break
      case 'most_voted':
        sortOptions = { upvotes: -1 }
        break
      case 'most_viewed':
        sortOptions = { views: -1 }
        break
      case 'most_answered':
        sortOptions = { answers: -1 }
        break
      // case 'recommended':
      //   break

      default:
        break
    }

    const user = await User.findOne({ userId }).populate({
      path: 'saved',
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id userId name picture' },
      ],
    })

    const isNext = user.saved.length > pageSize
    // if (!user) throw new Error('User not found')
    if (!user) return

    const savedQuestions = user.saved

    return { questions: savedQuestions, isNext }
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

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: '$upvotes' },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: '$upvotes' },
        },
      },
    ])

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: '$upvotes' },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: '$upvotes' },
        },
      },
    ])

    const [questionViews] = await Answer.aggregate([
      { $match: { author: user._id } },

      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
        },
      },
    ])

    const criteria = [
      { type: 'QUESTION_COUNT' as BadgeCriteriaType, count: totalQuestions },
      { type: 'ANSWER_COUNT' as BadgeCriteriaType, count: totalAnswers },
      {
        type: 'QUESTION_UPVOTES' as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: 'ANSWER_UPVOTES' as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: 'TOTAL_VIEWS' as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ]

    const badgeCounts = assignBadges({ criteria })
    return {
      user,
      totalAnswers,
      totalQuestions,
      badgeCounts,
      reputation: user.reputation,
    }
  } catch (error) {
    console.log(error)

    throw error
  }
}
export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase()

    const { userId, page = 1, pageSize = 10 } = params

    const skipAmount = (page - 1) * pageSize

    const totalQuestions = await Question.countDocuments({
      author: userId,
    })

    const userQuestions = await Question.find({
      author: userId,
    })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .populate('tags', '_id name')
      .populate('author', '_id userId name picture')
      .skip(skipAmount)
      .limit(pageSize)

    const isNext = totalQuestions > skipAmount + userQuestions.length

    return { questions: userQuestions, totalQuestions, isNext }
  } catch (error) {
    console.log(error)

    throw error
  }
}
export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase()

    const { userId, page = 1, pageSize = 10 } = params
    const skipAmount = (page - 1) * pageSize

    const totalAnswers = await Answer.countDocuments({
      author: userId,
    })

    const userAnswers = await Answer.find({
      author: userId,
    })
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ upvotes: -1 })
      .populate('question', '_id title')
      .populate('author', '_id userId name picture')

    const isNext = totalAnswers > skipAmount + userAnswers.length

    return { answers: userAnswers, totalAnswers, isNext }
  } catch (error) {
    console.log(error)

    throw error
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase()

    const { userId, updateData, path } = params

    await User.findOneAndUpdate({ userId }, updateData, {
      new: true,
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
