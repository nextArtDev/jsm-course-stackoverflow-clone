import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface GetUserStatsParams {
  userId: string
}

export const getUserStats = async (params: GetUserStatsParams) => {
  try {
    const { userId } = params

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { userId: true, reputation: true },
    })

    if (!user) {
      return null // or handle accordingly
    }

    // Count total questions
    const totalQuestions = await prisma.question.count({
      where: { authorId: user.userId },
    })

    // Count total answers
    const totalAnswers = await prisma.answer.count({
      where: { authorId: user.userId },
    })

    // Calculate total question upvotes
    const questionUpvotesCount = await prisma.upvote.aggregate({
      where: { question: { authorId: user.userId } },
      _count: true,
    })

    // Calculate total answer upvotes
    const answerUpvotesCount = await prisma.upvote.aggregate({
      where: { answer: { authorId: user.userId } },
      _count: true,
    })

    // Calculate total question views
    const questionViews = await prisma.question.aggregate({
      where: { authorId: user.userId },
      _sum: { views: true },
    })

    // Build criteria for badge calculation
    const criteria = [
      { type: 'QUESTION_COUNT' as BadgeCriteriaType, count: totalQuestions },
      { type: 'ANSWER_COUNT' as BadgeCriteriaType, count: totalAnswers },
      {
        type: 'QUESTION_UPVOTES' as BadgeCriteriaType,
        count: questionUpvotesCount || 0,
      },
      {
        type: 'ANSWER_UPVOTES' as BadgeCriteriaType,
        count: answerUpvotesCount || 0,
      },
      {
        type: 'TOTAL_VIEWS' as BadgeCriteriaType,
        count: questionViews?._sum?.views || 0,
      },
    ]

    // Calculate badge counts
    const badgeCounts = assignBadges({ criteria })

    return {
      user,
      totalAnswers,
      totalQuestions,
      badgeCounts,
      reputation: user.reputation,
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Example usage:
const userId = 'your_user_id'
const result = await getUserStats({ userId })
console.log(result)
