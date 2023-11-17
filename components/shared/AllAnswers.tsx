import { FC } from 'react'
import Filter from './search/Filter'
import { AnswerFilters } from '@/constants'
import { getAnswers } from '@/lib/actions/answer.actions'
import Link from 'next/link'
import Image from 'next/image'
import { getTimestamp } from '@/lib/utils'
import ParseHTML from './ParseHTML'
import Votes from './Votes'
import Pagination from './Pagination'

interface AllAnswersProps {
  questionId: string
  userId: string
  totalAnswers: number
  page?: number
  filter?: string
}

const AllAnswers: FC<AllAnswersProps> = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}) => {
  const result = await getAnswers({
    questionId,
    page: page ? +page : 1,
    sortBy: filter,
  })
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="text-base">{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>

      <div>
        {result.answers.map((answer) => (
          <article key={answer._id} className="border-b py-10">
            <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer.author.userId}`}
                className="flex flex-1 items-start gap-1 sm:items-center"
              >
                <Image
                  src={answer.author.picture}
                  alt="profile"
                  width={18}
                  height={18}
                  className="rounded-full object-cover max-sm:mt-0.5"
                />
                <div className="flex flex-col sm:flex-row sm:items-center ">
                  <p className="font-semibold">{answer.author.name}</p>
                  <p className="ml-0.5 mt-0.5 line-clamp-1">
                    <span className="max-sm:hidden"> - </span> answered{' '}
                    {getTimestamp(answer.createdAt)}
                  </p>
                </div>
              </Link>
              <div className="flex justify-end">
                <Votes
                  type="Answer"
                  itemId={JSON.stringify(answer._id)}
                  userId={JSON.stringify(userId)}
                  upvotes={answer.upvotes.length}
                  hasupVoted={answer.upvotes.includes(userId)}
                  downvotes={answer.downvotes.length}
                  hasdownVoted={answer.downvotes.includes(userId)}
                />
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
      <Pagination pageNumber={page ? +page : 1} isNext={result.isNext} />
    </div>
  )
}

export default AllAnswers
