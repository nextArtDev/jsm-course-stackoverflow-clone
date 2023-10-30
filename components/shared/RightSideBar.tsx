import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import Chevron from '../../public/assets/icons/chevron-right.svg'
import RenderTag from './RenderTag'
interface RightSideBarProps {}

const hotQuestions = [
  {
    _id: 1,
    title:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, necessitatibus?',
  },
  {
    _id: 2,
    title:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, necessitatibus?',
  },
  {
    _id: 3,
    title:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, necessitatibus?',
  },
  {
    _id: 4,
    title:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, necessitatibus?',
  },
]

const PopularTags = [
  { _id: 1, name: 'javascript', totalQuestios: 5 },
  { _id: 2, name: 'nextjs', totalQuestios: 5 },
  { _id: 3, name: 'nodejs', totalQuestios: 4 },
  { _id: 4, name: 'threejs', totalQuestios: 2 },
  { _id: 5, name: 'mongodb', totalQuestios: 5 },
]
const RightSideBar: FC<RightSideBarProps> = () => {
  return (
    <section className="bg-transparent sticky right-0 top-0 flex min-h-screen flex-col overflow-y-auto border-l border-gray-700 p-6 pt-24 shadow max-xl:hidden w-[350px] ">
      <div>
        <h3 className="text-xl text-gray-200">Test Questions</h3>
      </div>
      <div className="mt-8 flex w-full flex-col gap-[30px] text-gray-400 text-sm">
        {hotQuestions.map((question) => (
          <Link
            href={`/questions/${question._id}`}
            key={question._id}
            className="flex cursor-pointer items-center justify-between gap-7"
          >
            <p>{question.title}</p>
            <Image src={Chevron} alt="chevron right" width={20} height={20} />
          </Link>
        ))}
        <h3 className="text-xl text-gray-200">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {PopularTags.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestios}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RightSideBar
