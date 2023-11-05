import Answer from '@/components/forms/Answer'
import AllAnswers from '@/components/shared/AllAnswers'
import Metric from '@/components/shared/Metric'
import ParseHTML from '@/components/shared/ParseHTML'
import RenderTag from '@/components/shared/RenderTag'
import Votes from '@/components/shared/Votes'
import { getQuestionById } from '@/lib/actions/question.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
  params: { id: string }
}

const page = async ({ params }: Props) => {
  const result = await getQuestionById({ questionId: params.id })

  // const {userId} = auth()
  const userId = '1'
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.userId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="font-semibold  ">{result.author.name}</p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="Question"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(userId)}
              upvotes={result.upvotes.length}
              hasupVoted={result.upvotes.includes(userId)}
              downvotes={result.downvotes.length}
              hasdownVoted={result.downvotes.includes(userId)}
              hasSaved={result?.saved.includes(result._id)}
            />
          </div>
          <h2 className="mt-3.5 w-full text-left text-lg font-semibold">
            {result.title}
          </h2>
        </div>

        <div className="mb-8 mt-5 flex flex-wrap gap-4">
          <Metric
            imgUrl="/assets/icons/clock.svg"
            alt="clock icon"
            value={`asked ${result.createdAt}`}
            title=" Asked"
            textStyles="text-sm md:text-md"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Message"
            value={result.answers.length}
            title="Answers"
            textStyles="text-sm md:text-md"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="Views"
            value={result.views}
            title="Views"
            textStyles="text-sm md:text-md"
          />
        </div>
      </div>
      <ParseHTML data={result.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={result._id}
        userId={userId}
        totalAnswers={result.answers.length}
      />
      <Answer
        question={result.content}
        questionId={JSON.stringify(result._id)}
        authorId={JSON.stringify(userId)}
      />
    </>
  )
}

export default page
