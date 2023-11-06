// import { UserButton } from '@clerk/nextjs'

import QuestionCard from '@/components/card/QuestionCard'
import NoResult from '@/components/shared/NoResult'
import Filter from '@/components/shared/search/Filter'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { QuestionFilters } from '@/constants'
import { getSavedQuestions } from '@/lib/actions/user.action'

const questions = [
  {
    _id: 1,
    title: 'Cascading Deletes in SQLAlchemy',
    tags: [
      { _id: 1, name: 'python' },
      { _id: 2, name: 'sql' },
    ],
    author: 'John Doe',
    upvotes: 10,
    views: 100,
    answers: 2,
    createdAt: '2023-09-01T12:00:00.000z',
  },
  {
    _id: 2,
    title: 'How to create CSS grid',
    tags: [
      { _id: 1, name: 'CSS' },
      { _id: 2, name: 'TailwindCSS' },
    ],
    author: 'John Doe',
    upvotes: 10,
    views: 100,
    answers: 2,
    createdAt: '2023-09-01T12:00:00.000z',
  },
]
export default async function Home() {
  // const {userId} = auth()
  const userId = '12346'
  const result = await getSavedQuestions({ userId })

  return (
    <>
      <h1 className="font-bold text-gray-100">Saved Questions</h1>

      <div className="mt-11 flex flex-col justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Question"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
        <div className="mt-10 flex w-full flex-col gap-6">
          {result.question.length > 0 ? (
            result.question.map((question) => (
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
              title="Theres no saved question to show"
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
