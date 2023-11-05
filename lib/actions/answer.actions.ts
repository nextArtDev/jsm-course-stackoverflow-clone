'use server'

import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import Tag from '@/database/tag.model'
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from './shared.types'
import User from '@/database/user.model'
import { revalidatePath } from 'next/cache'
import Answer from '@/database/answer.model'

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
    connectToDatabase()

    const { content, author, question, path } = params

    const newAnswer = await Answer.create({
      content,
      author,
      question,
    })

    // Add the answer to the question's answers array

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    })

    // TODO: add interaction...

    revalidatePath(path)
  } catch (error) {}
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase()

    const { questionId } = params

    const answers = await Answer.find({ question: questionId }).populate({
      path: 'author',
      model: User,
      select: '_id userId name picture',
    })

    return { answers }
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

    revalidatePath(path)
    // Increment authors reputation
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

    revalidatePath(path)
    // Increment authors reputation
  } catch (error) {
    console.log(error)
    throw error
  }
}
