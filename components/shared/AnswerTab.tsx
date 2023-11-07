import { getUserAnswers } from '@/lib/actions/user.action'
import { SearchParamsProps } from '@/types'
import { FC } from 'react'
import AnswerCard from '../card/AnswerCard'

interface AnswerTabProps extends SearchParamsProps {
  userId: string
}

const AnswerTab: FC<AnswerTabProps> = async ({ userId, searchProps }) => {
  const result = await getUserAnswers({
    userId,
    page: 1,
  })
  return (
    <>
      {result.answers.map((item) => (
        <AnswerCard
          key={item._id}
          userId={userId}
          _id={item._id}
          question={item.question}
          author={item.author}
          upvotes={item.upvotes.length}
          createdAt={item.createdAt}
        />
      ))}
    </>
  )
}

export default AnswerTab
