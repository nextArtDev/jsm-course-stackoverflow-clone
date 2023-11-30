import Link from 'next/link'
import { FC } from 'react'
import RenderTag from '../shared/RenderTag'
import Metric from '../shared/Metric'
import { formatLargeNumber, getTimestamp } from '@/lib/utils'
import EditDeleteAction from '../shared/EditDeleteAction'

interface QuestionCardProps {
  id: string
  title: string
  tags: { id: string; name: string }[]
  // author: { id: string; name: string; picture: string }
  author: string
  upvotes: string[]
  views: number
  answers: Array<object>
  createdAt: Date
  userId?: string
}

const QuestionCard: FC<QuestionCardProps> = ({
  id,
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
          <Link href={`/question/${id}`}>
            <h3 className="line-clamp-1 flex-1 text-base sm:font-semibold ">
              {title}
            </h3>
          </Link>
        </div>
        {/* edit and delete action  */}
        {/* <SignedIn>
          {showActionButtons && <EditDeleteAction />}
        </SignedIn> */}
        <EditDeleteAction type="Question" itemId={JSON.stringify(id)} />
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2 ">
        {tags.map((tag) => (
          <RenderTag key={tag.id} id={tag.id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        {/* <Metric
          // imgUrl={author.picture}
          imgUrl="/assets/icons/user.svg"
          alt="User"
          value={author}
          title={` - ${getTimestamp(new Date(createdAt))}`}
          textStyles="text-sm md:text-md"
          href={`/profile/${author.id}`}
          isAuthor
        /> */}
        <div className="max-sm:flex-start flex items-center gap-3 max-sm:flex-wrap ">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={upvotes}
            // value={formatLargeNumber(upvotes)}
            title="رای"
            textStyles="text-sm md:text-md"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Message"
            // value={answers.length}
            value={answers.length}
            title="جواب"
            textStyles="text-sm md:text-md"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="Views"
            value={views}
            title="مشاهده"
            textStyles="text-sm md:text-md"
          />
        </div>
      </div>
    </section>
  )
}

export default QuestionCard
