import Link from 'next/link'
import { FC } from 'react'
import RenderTag from '../shared/RenderTag'
import Metric from '../shared/Metric'
import { getTimestamp } from '@/lib/utils'

interface QuestionCardProps {
  _id: string
  title: string
  tags: { _id: string; name: string }[]
  // author: { _id: string; name: string; picture: string }
  author: string
  upvotes: number
  views: number
  answers: Array<object>
  createdAt: Date
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
}) => {
  return (
    <section className="rounded-[10px] p-9 sm:px-11 text-slate-300 ">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="line-clamp-1 sm:hidden flex">
            {getTimestamp(new Date(createdAt))}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:font-semibold text-base line-clamp-1 flex-1 ">
              {title}
            </h3>
          </Link>
        </div>
        {/* edit and delete action  */}
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
          value={upvotes}
          title={` - asked ${getTimestamp(new Date(createdAt))}`}
          textStyles="text-sm md:text-md"
          href={`/profile/${author._id}`}
          isAuthor
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          value={upvotes}
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
    </section>
  )
}

export default QuestionCard
