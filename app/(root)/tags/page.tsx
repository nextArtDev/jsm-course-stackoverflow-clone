import NoResult from '@/components/shared/NoResult'
import Filter from '@/components/shared/search/Filter'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { TagFilters, UserFilters } from '@/constants'
import { getAllTags } from '@/lib/actions/tag.actions'
import { SearchParamsProps } from '@/types'
import Link from 'next/link'

async function page({ searchParams }: SearchParamsProps) {
  const result = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
  })

  return (
    <div className="text-slate-200">
      <h1 className="font-bold text-gray-100"> All Tags</h1>

      <div className="mt-11 flex flex-col justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchbar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tags"
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <Link href={`/tags/${tag._id}`} key={tag._id} className="">
              <article className="flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                <div className="w-fit rounded-sm px-5 py-1.5">
                  <p className="text-slate-500 font-semibold ">{tag.name}</p>
                </div>
                <p className="mt-3.5">
                  <span className="mr-2.5 font-semibold ">
                    {tag.questions.length}
                  </span>{' '}
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title="No Tags Found"
            description="Its looks like there are no tags found."
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </section>
    </div>
  )
}

export default page
