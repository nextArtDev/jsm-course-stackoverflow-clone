'use server'

import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'

import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from './shared.types'
import User from '@/database/user.model'
import { revalidatePath } from 'next/cache'
import Answer from '@/database/answer.model'
import Interaction from '@/database/interaction.model'
import { prisma } from '../prisma'

// export async function getQuestions(params: GetQuestionsParams) {
//   try {
//     connectToDatabase()

//     const question = await Question.find({})
//       .populate({ path: 'tags', model: Tag })
//       .populate({ path: 'author', model: User })
//       .sort({ createdAt: -1 })

//     return { question }
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }
export async function createAnswer(params: CreateAnswerParams) {
  try {
    // connectToDatabase()

    const { content, author, question, path } = params

    // const newAnswer = await Answer.create({
    //   content,
    //   author,
    //   question,
    // })
    const newAnswer = await prisma.answer.create({
      data: {
        content,
        authorId: author,
        questionId: question,
      },
    })

    // Add the answer to the question's answers array

    // const questionObject = await Question.findByIdAndUpdate(question, {
    //   $push: { answers: newAnswer.id },
    // })
    const questionObject = await prisma.question.update({
      where: { id: author },
      data: {
        answers: {
          connect: {
            id: newAnswer.id,
          },
        },
      },
      include: { tags: true },
    })

    // Update the question to push the new answer

    // await Interaction.create({
    //   user: author,
    //   action: 'answer',
    //   question,
    //   answer: newAnswer.id,
    //   tags: questionObject.tags,
    // })
    // await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } })
    // await prisma.interaction.create({
    //   data: {
    //     userId: author,
    //     action: 'answer',
    //     question: { connect: { id: question } },
    //     answer: { connect: { id: newAnswer.id } },
    //     tags:questionObject.tags
    //   },
    // })

    revalidatePath(path)
  } catch (error) {}
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    // connectToDatabase()

    const { questionId, sortBy, page = 1, pageSize = 10 } = params

    const skipAmount = (page - 1) * pageSize

    let sortOptions = {}

    switch (sortBy) {
      case 'highestUpvotes':
        sortOptions = { upvotes: 'desc' }
        break
      case 'lowestUpvotes':
        sortOptions = { upvotes: 'asc' }
        break
      case 'recent':
        sortOptions = { created_at: 'desc' }
        break
      case 'old':
        sortOptions = { created_at: 'asc' }
        break

      default:
        break
    }

    // const answers = await Answer.find({ question: questionId })
    //   .populate({
    //     path: 'author',
    //     model: User,
    //     select: '_id userId name picture',
    //   })
    //   .skip(skipAmount)
    //   .limit(pageSize)
    //   .sort(sortOptions)

    const answers = await prisma.answer.findMany({
      where: { questionId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            phone: true,
            picture: true,
          },
        },
        upvoters: true,
        downvoters: true,
      },
      skip: skipAmount,
      take: pageSize,
      orderBy: sortOptions,
    })

    // const totalAnswers = await Answer.countDocuments({
    //   question: questionId,
    // })
    const totalAnswers = await prisma.answer.count({ where: { questionId } })

    const isNext = totalAnswers > skipAmount + answers.length

    return { answers, isNext }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase()

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params

    let updateQuery = {}
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } }
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      }
    } else {
      updateQuery = {
        $addToSet: {
          upvotes: userId,
        },
      }
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    })

    if (!answer) {
      throw new Error('Answer not Found')
    }
    // Increment authors reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : 2 },
    })
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase()

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params

    let updateQuery = {}
    if (hasdownVoted) {
      updateQuery = { $pull: { downvote: userId } }
    } else if (hasdownVoted) {
      updateQuery = {
        $push: { downvotes: userId },
        $pull: { upvotes: userId },
      }
    } else {
      updateQuery = {
        $addToSet: {
          downvotes: userId,
        },
      }
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    })

    if (!answer) {
      throw new Error('Answer not Found')
    }
    // Increment authors reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    })
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase()

    const { answerId, path } = params
    const answer = await Answer.findById(answerId)
    if (!answer) return

    await Answer.deleteOne({ _id: answerId })
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    )
    await Interaction.deleteMany({ answer: answerId })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
