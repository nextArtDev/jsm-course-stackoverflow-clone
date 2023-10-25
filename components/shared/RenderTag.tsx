import Link from 'next/link'
import { FC } from 'react'
import { Badge } from '../ui/badge'

interface RenderTagProps {
  _id: string
  name: string
  totalQuestions?: number
  showCount?: boolean
}

const RenderTag: FC<RenderTagProps> = ({
  _id,
  name,
  totalQuestions,
  showCount,
}) => {
  return (
    <Link href={`/tag/${_id}`} className="flex justify-between gap-2 ">
      <Badge className="rounded-md border-none bg-gray-600 px-4 py-2 uppercase">
        {name}
      </Badge>
      {showCount && <p className="text-gray-600">{totalQuestions}</p>}
    </Link>
  )
}

export default RenderTag
