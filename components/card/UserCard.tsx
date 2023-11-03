import { getTopInteractedTags } from '@/lib/actions/tag.actions'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import { Badge } from '../ui/badge'
import RenderTag from '../shared/RenderTag'
import { Tag } from 'lucide-react'

interface UserCardProps {
  user: {
    _id: string
    userId: string
    picture: string
    name: string
    username: string
  }
}

const UserCard: FC<UserCardProps> = async ({ user }) => {
  // const interactedTags = await getTopInteractedTags({userId:user._id})
  const interactedTags = await getTopInteractedTags({})
  return (
    <Link
      href={`/profile/${user.userId}`}
      className="w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="w-full flex-col items-center justify-center rounded-2xl border bg-white/20 p-8">
        <Image
          src={user.picture}
          alt="user profile picture"
          width={100}
          height={100}
          className="rounded-full"
        />

        <div className="mt-4 text-center">
          <h3 className="font-bold text-slate-300">{user.name}</h3>
          <p className="text-slate-400 mt-2 ">@{user.username}</p>
        </div>

        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div>
              {interactedTags.map((tag) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No Tags Yet</Badge>
          )}
        </div>
      </article>
    </Link>
  )
}

export default UserCard
