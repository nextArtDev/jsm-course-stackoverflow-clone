'use server'

import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import Tag from '@/database/tag.model'
import {
  CreateAnswerParams,
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
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

    const newAnswer = new Answer({
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

// export async function getQuestionById(params: GetQuestionByIdParams) {
//   try {
//     connectToDatabase()

//     const { questionId } = params
//     const question = await Question.findById(questionId)
//       .populate({ path: 'tags', model: Tag, select: '_id name' })
//       .populate({
//         path: 'author',
//         model: User,
//         select: '_id userId name picture',
//       })

//     return question
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }
