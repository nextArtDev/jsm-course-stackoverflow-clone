// import { UserButton } from '@clerk/nextjs'

import HomeFilters from '@/components/home/HomeFilters'
import Filter from '@/components/shared/search/Filter'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { Button } from '@/components/ui/button'
import { HomePageFilters } from '@/constants'
import Link from 'next/link'

export default function Home() {
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
      </div>
    </>
  )
}
