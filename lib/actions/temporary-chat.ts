import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Assuming you have a Prisma model named 'User'
// and 'saved' is a relation between users and saved questions

interface GetUserDataParams {
  userId: string
  filter:
    | 'most_recent'
    | 'oldest'
    | 'most_voted'
    | 'most_viewed'
    | 'most_answered'
  query: any // Replace with the actual query structure for matching
  skipAmount: number
  pageSize: number
}

export const getUserData = async (params: GetUserDataParams) => {
  try {
    const { userId, filter, query, skipAmount, pageSize } = params

    // Define sort options based on the filter
    let orderByOptions: any = {}
    switch (filter) {
      case 'most_recent':
        orderByOptions = { createdAt: 'desc' }
        break
      case 'oldest':
        orderByOptions = { createdAt: 'asc' }
        break
      case 'most_voted':
        orderByOptions = { upvotes: 'desc' }
        break
      case 'most_viewed':
        orderByOptions = { views: 'desc' }
        break
      case 'most_answered':
        orderByOptions = { answers: 'desc' }
        break
      // case 'recommended':
      //   break;
      default:
        break
    }

    // Fetch user data with sorting and pagination
    const userData = await prisma.user.findUnique({
      where: { userId },
      include: {
        saved: {
          where: query,
          orderBy: orderByOptions,
          skip: skipAmount,
          take: pageSize + 1,
          include: {
            tags: { select: { _id: true, name: true } },
            author: {
              select: { _id: true, userId: true, name: true, picture: true },
            },
          },
        },
      },
    })

    return userData
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Example usage:
const userDataParams = {
  userId: 'your_user_id',
  filter: 'most_recent',
  query: {}, // Replace with the actual query structure for matching
  skipAmount: 0,
  pageSize: 10,
}

const result = await getUserData(userDataParams)
console.log(result)
