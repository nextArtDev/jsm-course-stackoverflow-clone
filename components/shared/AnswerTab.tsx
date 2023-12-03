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
          key={item.id}
          userId={userId}
          id={item.id}
          question={item.Question}
          author={item.author}
          upvotes={item.upvoters}
          createdAt={item.created_at}
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
