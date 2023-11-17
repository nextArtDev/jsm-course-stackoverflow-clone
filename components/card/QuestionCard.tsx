import Link from 'next/link'
import { FC } from 'react'
import RenderTag from '../shared/RenderTag'
import Metric from '../shared/Metric'
import { getTimestamp } from '@/lib/utils'
import EditDeleteAction from '../shared/EditDeleteAction'

interface QuestionCardProps {
  _id: string
  title: string
  tags: { _id: string; name: string }[]
  // author: { _id: string; name: string; picture: string }
  author: string
  upvotes: string[]
  views: number
  answers: Array<object>
  createdAt: Date
  userId?: string
}

const QuestionCard: FC<QuestionCardProps> = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
  userId,
}) => {
  // const showActionButtons = userId && userId === author.userId
  return (
    <section className="rounded-[10px] p-9 text-slate-300 sm:px-11 ">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="line-clamp-1 flex sm:hidden">
            {getTimestamp(new Date(createdAt))}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="line-clamp-1 flex-1 text-base sm:font-semibold ">
              {title}
            </h3>
          </Link>
        </div>
        {/* edit and delete action  */}
        {/* <SignedIn>
          {showActionButtons && <EditDeleteAction />}
        </SignedIn> */}
        <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2 ">
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="User"
          value={author}
          title={` - asked ${getTimestamp(new Date(createdAt))}`}
          textStyles="text-sm md:text-md"
          href={`/profile/${author._id}`}
          isAuthor
        />
        <div className="max-sm:flex-start flex items-center gap-3 max-sm:flex-wrap ">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={upvotes.length}
            title="Votes"
            textStyles="text-sm md:text-md"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Message"
            value={answers.length}
            title="Answers"
            textStyles="text-sm md:text-md"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="Views"
            value={views}
            title="Views"
            textStyles="text-sm md:text-md"
          />
        </div>
      </div>
    </section>
  )
}

export default QuestionCard
