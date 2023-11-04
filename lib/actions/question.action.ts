'use server'

import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import Tag from '@/database/tag.model'
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
} from './shared.types'
import User from '@/database/user.model'
import { revalidatePath } from 'next/cache'

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase()

    const question = await Question.find({})
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 })

    return { question }
  } catch (error) {
    console.log(error)
    throw error
  }
}
export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase()

    const { title, content, tags, author, path } = params

    const question = await Question.create({
      title,
      content,
      author,
    })

    const tagDocuments = []

    // Create the tags or get them if they already exist

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      )
      tagDocuments.push(existingTag._id)
    }

    await Question.findOneAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    })

    revalidatePath(path)

    // create an interaction record for the user's ask_question action

    // Increment author's reputation by +5 for creating a question
  } catch (error) {}
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase()

    const { questionId } = params
    const question = await Question.findById(questionId)
      .populate({ path: 'tags', model: Tag, select: '_id name' })
      .populate({
        path: 'author',
        model: User,
        select: '_id userId name picture',
      })

    return question
  } catch (error) {
    console.log(error)
    throw error
  }
}
