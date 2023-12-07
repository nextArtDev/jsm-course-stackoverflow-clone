// import { UserButton } from '@clerk/nextjs'

import QuestionCard from '@/components/card/QuestionCard'
import NoResult from '@/components/shared/NoResult'
import Pagination from '@/components/shared/Pagination'
import Filter from '@/components/shared/search/Filter'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { QuestionFilters } from '@/constants'
import { getCurrentUser } from '@/lib/actions/getCurrentUser'
import { getSavedQuestions } from '@/lib/actions/user.action'
import { SearchParamsProps } from '@/types'
import { redirect } from 'next/navigation'
import searchImage from '@/public/assets/icons/search.svg'

export default async function Home({ searchParams }: SearchParamsProps) {
  // const {userId} = auth()
  const currentUser = await getCurrentUser()
  if (!currentUser) redirect('/sign-in')

  const userId = currentUser?.id

  const result = await getSavedQuestions({
    userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  })
  // const { question, isNext } = result
  // console.log(result?.questions)
  return (
    <>
      <h1 className="font-bold text-gray-100">سوالات ذخیره شده</h1>

      <div className="mt-11 flex flex-col justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc={searchImage}
          placeholder="جست و جوی سوال"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
        <div className="mt-10 flex w-full flex-col gap-6">
          {result?.questions?.length ? (
            result?.questions?.map((question) => (
              <QuestionCard
                key={question.id}
                id={question.id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvoters}
                views={question?.views}
                answers={question.answers}
                createdAt={question.created_at}
              />
            ))
          ) : (
            <NoResult
              title="سوال ذخیره شده‌ای برای نمایش وجود ندارد."
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
