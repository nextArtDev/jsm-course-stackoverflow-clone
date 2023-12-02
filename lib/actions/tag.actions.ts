'use server'

import User from '@/database/user.model'
import { connectToDatabase } from '../mongoose'
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from './shared.types'
import Tag, { ITag } from '@/database/tag.model'
import Question from '@/database/question.model'
import { FilterQuery } from 'mongoose'
import { prisma } from '../prisma'

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    // connectToDatabase()

    const { phone, limit = 3 } = params

    // const user = await User.findById(userId)
    const user = await prisma.user.findUnique({ where: { phone } })

    if (!user) throw new Error('User not found')

    // Find interactions for the user and group by tags...
    // Interaction

    return [
      { id: 1, name: 'سوال' },
      { id: 2, name: 'جواب' },
      { id: 3, name: 'تگ سوم' },
    ]
  } catch (error) {
    console.log(error)

    throw error
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase()

    const { searchQuery, filter, page = 1, pageSize = 10 } = params

    const skipAmount = (page - 1) * pageSize

    // const query: FilterQuery<typeof Tag> = {}
    const query: any = {}

    // if (searchQuery) {
    //   query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }]
    // }
    if (searchQuery) {
      query.OR = [{ name: { contains: searchQuery } }]
    }
    let sortOptions = {}

    // switch (filter) {
    //   case 'popular':
    //     sortOptions = { questions: -1 }
    //     break
    //   case 'recent':
    //     sortOptions = { createdAt: 1 }
    //     break
    //   case 'name':
    //     sortOptions = { name: 1 }
    //     break
    //   case 'old':
    //     sortOptions = { createdAt: 1 }
    //     break

    //   default:
    //     break
    // }
    switch (filter) {
      case 'popular':
        sortOptions = {
          questions: {
            _count: 'desc',
          },
        }
        break
      case 'recent':
        sortOptions = { created_at: 'desc' }
        break
      case 'name':
        sortOptions = { name: 'asc' }
        break
      case 'old':
        sortOptions = { created_at: 'asc' }
        break

      default:
        break
    }

    // const tags = await Tag.find(query)
    //   .skip(skipAmount)
    //   .limit(pageSize + 1)
    //   .sort(sortOptions)

    const tags = await prisma.tag.findMany({
      where: query,
      include: {
        questions: true,
      },
      skip: skipAmount,
      take: pageSize,
      orderBy: sortOptions,
    })

    // const totalTags = await Tag.countDocuments(query)
    const totalTags = await prisma.tag.count({ where: query })

    const isNext = totalTags > skipAmount + tags.length
    return { tags, isNext }
  } catch (error) {
    console.log(error)

    throw error
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    // connectToDatabase()
    const { tagId, page = 1, pageSize = 10, filter, searchQuery } = params

    const skipAmount = (page - 1) * pageSize

    // const tagFilter: FilterQuery<ITag> = { id: tagId }
    // const tag = await Tag.findOne({ tagFilter }).populate({
    //   path: 'questions',
    //   model: Question,
    //   match: searchQuery
    //     ? { title: { $regex: searchQuery, $options: 'i' } }
    //     : {},
    //   options: {
    //     sort: { createdAt: -1 },
    //     skip: skipAmount,
    //     limit: pageSize + 1,
    //   },
    //   populate: [
    //     { path: 'tags', model: Tag, select: '_id name' },
    //     { path: 'author', model: User, select: '_id tagId name picture' },
    //   ],
    // })

    // Prisma query options

    const tag = await prisma.tag.findFirst({
      where: { id: +tagId },
      include: {
        questions: {
          where: searchQuery ? { title: { contains: searchQuery } } : {},
          orderBy: { created_at: 'desc' },
          skip: skipAmount,
          take: pageSize + 1,
          include: {
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
            author: {
              select: {
                id: true,
                authoredQuestions: true,
                name: true,
                picture: true,
              },
            },
            upvoters: true,
            answers: true,
          },
        },
      },
    })

    // if (!tag) throw new Error('User not found')
    if (!tag) return

    // const isNext = tags.question.length > pageSize
    const isNext = tag.questions.length > pageSize

    const questions = tag.questions

    return { tagTitle: tag.name, questions, isNext }
  } catch (error) {
    console.log(error)

    throw error
  }
}

export async function getTopPopularTags() {
  try {
    connectToDatabase()

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: '$questions' } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ])

    return popularTags
  } catch (error) {
    console.log(error)

    throw error
  }
}
