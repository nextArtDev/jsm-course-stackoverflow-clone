// import { UserButton } from '@clerk/nextjs'

import QuestionCard from '@/components/card/QuestionCard'
import HomeFilters from '@/components/home/HomeFilters'
import NoResult from '@/components/shared/NoResult'
import Pagination from '@/components/shared/Pagination'
import Filter from '@/components/shared/search/Filter'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants'
import {
  getQuestions,
  getRecommendedQuestions,
} from '@/lib/actions/question.action'
import { SearchParamsProps } from '@/types'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Home | DevFlow',
  description:
    'A community-driven platform for asking and answering programming questions',
}

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
export default async function Home({ searchParams }: SearchParamsProps) {
  const userId = '12346'

  let result
  if (searchParams?.filter === 'recommended') {
    if (!userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: searchParams.q,
        page: searchParams.page ? +searchParams.page : 1,
      })
    } else {
      result = {
        questions: [],
        isNext: false,
      }
    }
  } else {
    result = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? +searchParams.page : 1,
    })
  }

  // console.log(result.question)

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center ">
        <h1 className="font-bold text-gray-100"> All Questions</h1>
        <Link href={'/ask-question'} className="flex justify-end max-sm:w-full">
          <Button className="min-h-[46px] bg-gradient-to-tr from-slate-600 via-slate-800 to-slate-400 px-4 py-3 text-gray-200 shadow-inner shadow-slate-400  ">
            Ask A Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex flex-col justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Question"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
        <HomeFilters />
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
              title="Theres no question to show"
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
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  )
}
