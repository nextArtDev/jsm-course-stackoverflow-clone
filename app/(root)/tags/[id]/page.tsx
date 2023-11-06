import QuestionCard from '@/components/card/QuestionCard'
import NoResult from '@/components/shared/NoResult'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { IQuestion } from '@/database/question.model'
import { getQuestionsByTagId } from '@/lib/actions/tag.actions'
import { URLProps } from '@/types'
import { FC } from 'react'

// interface pageProps {
//   params: { id: string }
//   searchParams: string
// }

const page: FC<URLProps> = async ({ params, searchParams }) => {
  const result = await getQuestionsByTagId({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams.q,
  })

  return (
    <>
      <h1 className="font-bold text-gray-100"> {result?.tagTitle}</h1>

      <div className="mt-11 w-full">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search tag Question"
          otherClasses="flex-1"
        />

        <div className="mt-10 flex w-full flex-col gap-6">
          {result?.questions.length > 0 ? (
            result?.questions.map((question: IQuestion) => (
              <QuestionCard
                key={question._id}
                _id={question._id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvotes}
                views={question.views}
                answers={question.answers}
                createdAt={question.createdAt}
              />
            ))
          ) : (
            <NoResult
              title="Theres no tag question to show"
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Provident
        quibusdam tempora veritatis id facere animi sequi ipsam adipisci, error
        repudiandae, repellendus debitis omnis ab iusto, explicabo quia quod
        quos. Corporis."
              link="/ask-question"
              linkTitle="Ask A Question"
            />
          )}
        </div>
      </div>
    </>
  )
}

export default page
