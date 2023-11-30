'use server'

import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import Tag from '@/database/tag.model'
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
  RecommendedParams,
} from './shared.types'
import User from '@/database/user.model'
import { revalidatePath } from 'next/cache'
import Answer from '@/database/answer.model'
import Interaction from '@/database/interaction.model'
import { FilterQuery } from 'mongoose'
import { prisma } from '../prisma'
import { getCurrentUser } from './getCurrentUser'

export async function getQuestions(params: GetQuestionsParams) {
  try {
    // connectToDatabase()
    const { searchQuery, filter, page = 1, pageSize = 10 } = params

    const skipAmount = (page - 1) * pageSize
    const query: any = {} // This will be used to build the Prisma query

    if (searchQuery) {
      query.OR = [
        { title: { contains: searchQuery } },
        { content: { contains: searchQuery } },
      ]
    }

    let orderByOptions: any = {} // This will be used to define the sorting options

    switch (filter) {
      case 'جدیدترین':
        orderByOptions = { createdAt: 'desc' }
        break
      case 'پرتکرار':
        orderByOptions = { views: 'desc' }
        break
      case 'بدون جواب':
        orderByOptions = {
          answers: {
            _count: 'desc',
          },
        }

        break
      default:
        break
    }

    // Fetch questions using Prisma
    const questions = await prisma.question.findMany({
      where: query,
      include: {
        tags: true, // Include the related tags
        author: true, // Include the related author
        answers: true,
      },
      skip: skipAmount,
      take: pageSize,
      orderBy: orderByOptions,
    })
    // console.log(questions)

    // Fetch the total count of questions for pagination
    const totalQuestions = await prisma.question.count({ where: query })

    // Calculate if there are more questions to be fetched
    const isNext = totalQuestions > skipAmount + questions.length

    // const query: FilterQuery<typeof Question> = {}

    // if (searchQuery) {
    //   query.$or = [
    //     { title: { $regex: new RegExp(searchQuery, 'i') } },
    //     { content: { $regex: new RegExp(searchQuery, 'i') } },
    //   ]
    // }

    // let sortOptions = {}

    // switch (filter) {
    //   case 'newest':
    //     sortOptions = { createdAt: -1 }
    //     break
    //   case 'frequent':
    //     sortOptions = { views: -1 }
    //     break
    //   case 'unanswered':
    //     query.answers = { $size: 0 }
    //     break

    //   default:
    //     break
    // }
    // const question = await Question.find(query)
    //   .populate({ path: 'tags', model: Tag })
    //   .populate({ path: 'author', model: User })
    //   .skip(skipAmount)
    //   .limit(pageSize)
    //   .sort(sortOptions)

    // const totalQuestions = await Question.countDocuments(query)

    // const isNext = totalQuestions > skipAmount + question.length

    return { questions, isNext }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    // connectToDatabase()
    const currentUser = await getCurrentUser()
    const { title, content, tags, authorId, path } = params
    if (!currentUser) return

    // const question = await Question.create({
    //   title,
    //   content,
    //   author,
    // })
    const question = await prisma.question.create({
      data: {
        title,
        content,
        authorId,
      },
    })

    const tagDocuments = []

    for (const tag of tags) {
      const existingTag = await prisma.tag.findUnique({
        where: {
          name: tag,
        },
      })

      if (existingTag) {
        tagDocuments.push(existingTag.id)
      } else {
        const newTag = await prisma.tag.create({
          data: {
            name: tag,
            questions: { connect: { id: question.id } },
            // followers: { connect: { id: authorId } },
          },
        })
        tagDocuments.push(newTag.id)
      }
    }

    // Connect tags to the question
    await prisma.question.update({
      where: { id: question.id },
      data: { tags: { connect: tagDocuments.map((id) => ({ id })) } },
    })

    // Create an interaction record
    // const interaction = await prisma.interaction.create({
    //   data: {
    //     user: { connect: { id: authorId } },
    //     action: 'ask_question',
    //     question: { connect: { id: question.id } },
    //     tags: { connect: tagDocuments.map((id) => ({ id })) },
    //   },
    // })
    // console.log(interaction)
    // // Increment author's reputation by +5 for creating a question
    // await prisma.user.update({
    //   where: { id: authorId },
    //   data: { reputation: { increment: 5 } },
    // })

    // Create the tags or get them if they already exist

    // for (const tag of tags) {
    //   const existingTag = await Tag.findOneAndUpdate(
    //     { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
    //     { $setOnInsert: { name: tag }, $push: { questions: question.id } },
    //     { upsert: true, new: true }
    //   )
    //   tagDocuments.push(existingTag.id)
    // }

    // await Question.findOneAndUpdate(question.id, {
    //   $push: { tags: { $each: tagDocuments } },
    // })

    // create an interaction record for the user's ask_question action

    // await Interaction.create({
    //   user: author,
    //   action: 'ask_question',
    //   question: question.id,
    //   tags: tagDocuments,
    // })
    // Increment author's reputation by +5 for creating a question

    // await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    // await connectToDatabase()

    const { questionId } = params
    // const question = await Question.findById(questionId)
    //   .populate({ path: 'tags', model: Tag, select: 'id name' })
    //   .populate({
    //     path: 'author',
    //     model: User,
    //     select: 'id userId name picture',
    //   })

    const question = await prisma.question.findFirst({
      where: { id: questionId },
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
            name: true,
            picture: true,
          },
        },
        answers: true,
        upvoters: true,
        downvoters: true,
      },
    })
    return { question }
  } catch (error) {
    console.log(error)
    throw error
  }
}

// export async function upvoteQuestion(params: QuestionVoteParams) {
//   try {
//     connectToDatabase()

//     const { questionId, userId, hasupVoted, hasdownVoted, path } = params

//     let updateQuery = {}
//     if (hasupVoted) {
//       updateQuery = { $pull: { upvotes: userId } }
//     } else if (hasdownVoted) {
//       updateQuery = {
//         $pull: { downvotes: userId },
//         $push: { upvotes: userId },
//       }
//     } else {
//       updateQuery = {
//         $addToSet: {
//           upvotes: userId,
//         },
//       }
//     }
//     const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
//       new: true,
//     })

//     if (!question) {
//       throw new Error('Question not Found')
//     }

//     // Increment authors reputation by +1/-1 for upvoting/revoking an upvote to a question
//     await User.findByIdAndUpdate(userId, {
//       $inc: { reputation: hasupVoted ? -1 : 1 },
//     })

//     await User.findByIdAndUpdate(question.author, {
//       $inc: { reputation: hasupVoted ? -10 : 10 },
//     })

//     revalidatePath(path)
//     // Increment authors reputation
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }

// export async function downvoteQuestion(params: QuestionVoteParams) {
//   try {
//     connectToDatabase()

//     const { questionId, userId, hasupVoted, hasdownVoted, path } = params

//     let updateQuery = {}
//     if (hasdownVoted) {
//       updateQuery = { $pull: { downvote: userId } }
//     } else if (hasdownVoted) {
//       updateQuery = {
//         $push: { downvotes: userId },
//         $pull: { upvotes: userId },
//       }
//     } else {
//       updateQuery = {
//         $addToSet: {
//           downvotes: userId,
//         },
//       }
//     }
//     const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
//       new: true,
//     })

//     if (!question) {
//       throw new Error('Question not Found')
//     }
//     // Increment authors reputation
//     await User.findByIdAndUpdate(userId, {
//       $inc: { reputation: hasdownVoted ? -2 : 2 },
//     })

//     await User.findByIdAndUpdate(question.author, {
//       $inc: { reputation: hasdownVoted ? -10 : 10 },
//     })

//     revalidatePath(path)
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }

// export async function deleteQuestion(params: DeleteQuestionParams) {
//   try {
//     connectToDatabase()

//     const { questionId, path } = params
//     await Question.deleteOne({ id: questionId })
//     await Answer.deleteMany({ question: questionId })
//     await Interaction.deleteMany({ question: questionId })
//     await Tag.updateMany(
//       { questions: questionId },
//       { $pull: { questions: questionId } }
//     )

//     revalidatePath(path)
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }

// export async function editQuestion(params: EditQuestionParams) {
//   try {
//     connectToDatabase()

//     const { questionId, title, content, path } = params

//     const question = await Question.findById(questionId).populate('tags')

//     if (!question) return

//     question.title = title
//     question.content = content

//     await question.save()

//     revalidatePath(path)
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }

// export async function getHotQuestions() {
//   try {
//     connectToDatabase()

//     const hotQuestions = await Question.find({})
//       .sort({
//         views: -1,
//         upvotes: -1,
//       })
//       .limit(5)

//     return hotQuestions
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }

// export async function getRecommendedQuestions(params: RecommendedParams) {
//   try {
//     await connectToDatabase()

//     const { userId, page = 1, pageSize = 10, searchQuery } = params

//     const user = await User.findOne({ userId })

//     if (!user) return
//     const skipAmount = (page - 1) * pageSize

//     const userInteractions = await Interaction.find({ user: user.id })
//       .populate('tags')
//       .exec()

//     const userTags = userInteractions.reduce((tags, interaction) => {
//       if (interaction.tags) {
//         tags = tags.concat(interaction.tags)
//       }
//       return tags
//     }, [])

//     const distinctUserTagIds = [...new Set(userTags.map((tag: any) => tag.id))]

//     const query: FilterQuery<typeof Question> = {
//       $and: [
//         { tags: { $in: distinctUserTagIds } },
//         { author: { $ne: user.id } },
//       ],
//     }
//     if (searchQuery) {
//       query.$or = [
//         { title: { $regex: searchQuery, $options: 'i' } },
//         { content: { $regex: searchQuery, $options: 'i' } },
//       ]
//     }

//     const totalQuestions = await Question.countDocuments(query)

//     const recommendedQuestions = await Question.find(query)
//       .populate({
//         path: 'tags',
//         model: Tag,
//       })
//       .populate({
//         path: 'author',
//         model: User,
//       })
//       .skip(skipAmount)
//       .limit(pageSize)

//     const isNext = totalQuestions > skipAmount + recommendedQuestions.length

//     return { questions: recommendedQuestions, isNext }
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }
