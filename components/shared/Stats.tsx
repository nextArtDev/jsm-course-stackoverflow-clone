import Image from 'next/image'
import { FC } from 'react'
import GoldImage from '../../public/assets/icons/gold-medal.svg'
import SilverImage from '../../public/assets/icons/silver-medal.svg'
import BronzeImage from '../../public/assets/icons/bronze-medal.svg'
interface StatsProps {
  totalQuestions: number | undefined
  totalAnswers: number | undefined
}

const Stats: FC<StatsProps> = ({ totalQuestions, totalAnswers }) => {
  return (
    <div className="mt-10">
      <h4 className="font-semibold ">Stats</h4>
      <div className="xs:grid-cols-2 mt-5 grid grid-cols-1 gap-5 md:grid-cols-4 ">
        <div className="flex flex-wrap items-center justify-evenly gap-4 rounded-md border shadow-lime-200 ">
          <div>
            <p className="font-semibold">{totalQuestions}</p>
            <p>Questions</p>
          </div>
          <div>
            <p className="font-semibold">{totalAnswers}</p>
            <p>Answers</p>
          </div>
        </div>
        <StatsCard imgUrl={GoldImage.src} value={0} title="Gold Badges" />
        <StatsCard imgUrl={SilverImage.src} value={0} title="Silver Badges" />
        <StatsCard imgUrl={BronzeImage.src} value={0} title="Bronze Badges" />
      </div>
    </div>
  )
}

export default Stats

interface statsCardProps {
  imgUrl: string
  value: number
  title: string
}
export const StatsCard = ({ imgUrl, value, title }: statsCardProps) => {
  return (
    <div className="flex flex-wrap items-center justify-start gap-4 rounded-md border shadow-lime-200 ">
      <Image src={imgUrl} alt={title} width={40} height={50} />
      <div>
        <p className="font-semibold">{value}</p>
        <p className="font-semibold">{title}</p>
      </div>
    </div>
  )
}
