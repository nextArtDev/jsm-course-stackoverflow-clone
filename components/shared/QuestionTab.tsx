import { getUserQuestions } from '@/lib/actions/user.action'
import { SearchParamsProps } from '@/types'
import { FC } from 'react'
import QuestionCard from '../card/QuestionCard'

interface QuestionTabProps extends SearchParamsProps {
  userId: string
}

const QuestionTab: FC<QuestionTabProps> = async ({ searchProps, userId }) => {
  const result = await getUserQuestions({
    userId,
    page: 1,
  })
  return (
    <>
      {result.questions.map((question) => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          userId={userId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}
    </>
  )
}

export default QuestionTab