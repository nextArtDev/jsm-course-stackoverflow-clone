import UserCard from '@/components/card/UserCard'
import Filter from '@/components/shared/search/Filter'
import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
import { UserFilters } from '@/constants'
import { getAllUsers } from '@/lib/actions/user.action'
import { SearchParamsProps } from '@/types'
import Link from 'next/link'

async function page({ searchParams }: SearchParamsProps) {
  const result = await getAllUsers({
    searchQuery: searchParams.q,
  })

  return (
    <div className="text-slate-200">
      <h1 className="font-bold text-gray-100"> All Users</h1>

      <div className="mt-11 flex flex-col justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchbar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="mx-auto max-w-4xl text-center">
            <p>No Users Found.</p>
            <Link href={'/sign-up'} className="text-blue-300 mt-4 font-bold">
              Join to be the first
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

export default page
