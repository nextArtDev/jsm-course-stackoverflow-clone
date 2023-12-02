import { FC } from 'react'
import Metric from '../shared/Metric'
import Link from 'next/link'
import { getTimestamp } from '@/lib/utils'
import RenderTag from '../shared/RenderTag'
import EditDeleteAction from '../shared/EditDeleteAction'

interface AnswerCardProps {
  _id: string
  author: string
  upvotes: string[]
  question: Array<object>
  createdAt: Date
  userId?: string
}

const AnswerCard: FC<AnswerCardProps> = ({
  _id,
  author,
  upvotes,
  question,
  createdAt,
  userId,
}) => {
  // const showActionButtons = userId && userId === author.userId
  return (
    <Link
      href={`/question/${question?.id}/#${id}`}
      className="rounded-[10px] px-11 py-9"
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <h3 className="line-clamp-1 flex sm:hidden">{question.title}</h3>
        </div>
        {/* <SignedIn>
          {showActionButtons && <EditDeleteAction />}
        </SignedIn> */}
        <EditDeleteAction type="Question" itemId={JSON.stringify(id)} />
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="User"
          value={author.name}
          title={` - asked ${getTimestamp(new Date(createdAt))}`}
          textStyles="text-sm md:text-md"
          href={`/profile/${author.userId}`}
          isAuthor
        />
        <div className="flex items-center justify-center gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={upvotes.length}
            title="Votes"
            textStyles="text-sm md:text-md"
          />
        </div>
      </div>
    </Link>
  )
}

export default AnswerCard
