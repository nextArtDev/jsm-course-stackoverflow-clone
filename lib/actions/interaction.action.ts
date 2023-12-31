'use server'

import Question from '@/database/question.model'
import { connectToDatabase } from '../mongoose'
import { ViewQuestionParams } from './shared.types'
import Interaction from '@/database/interaction.model'
import { prisma } from '../prisma'

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    // await connectToDatabase()

    const { questionId, userId } = params

    // Update view count for the question
    // await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } })

    // if (userId) {
    //   const existingInteraction = await Interaction.findOne({
    //     user: userId,
    //     action: 'view',
    //     question: questionId,
    //   })
    //   if (existingInteraction) return
    //   await Interaction.create({
    //     user: userId,
    //     action: 'view',
    //     question: questionId,
    //   })
    // }

    await prisma.question.update({
      where: { id: questionId },
      data: { views: { increment: 1 } },
    })

    if (userId) {
      const existingInteraction = await prisma.interaction.findFirst({
        where: {
          userId,
          action: 'view',
          questionId,
        },
      })
      if (existingInteraction) return
      await prisma.interaction.create({
        data: {
          userId,
          action: 'view',
          questionId,
        },
      })
    }
  } catch (error) {
    console.log(error)
  }
}
