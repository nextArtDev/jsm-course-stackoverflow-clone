import { getUserQuestions } from '@/lib/actions/user.action'
import { SearchParamsProps } from '@/types'
import { FC } from 'react'
import QuestionCard from '../card/QuestionCard'
import Pagination from './Pagination'

interface QuestionTabProps extends SearchParamsProps {
  userId: string
}

const QuestionTab: FC<QuestionTabProps> = async ({ searchParams, userId }) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  })
  return (
    <>
      {result.questions.map((question) => (
        <QuestionCard
          key={question.id}
          id={question.id}
          userId={userId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvoters}
          views={question.views}
          answers={question.answers}
          createdAt={question.created_at}
        />
      ))}
      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  )
}

export default QuestionTab
