import { getUserAnswers } from '@/lib/actions/user.action'
import { SearchParamsProps } from '@/types'
import { FC } from 'react'
import AnswerCard from '../card/AnswerCard'
import Pagination from './Pagination'

interface AnswerTabProps extends SearchParamsProps {
  userId: string
}

const AnswerTab: FC<AnswerTabProps> = async ({ userId, searchParams }) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
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
      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  )
}

export default AnswerTab
