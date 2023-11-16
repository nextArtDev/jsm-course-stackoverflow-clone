'use client'
import { downvoteAnswer, upvoteAnswer } from '@/lib/actions/answer.actions'
import { viewQuestion } from '@/lib/actions/interaction.action'
import { downvoteQuestion, upvoteQuestion } from '@/lib/actions/question.action'
import { toggleSaveQuestion } from '@/lib/actions/user.action'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'
import { toast } from '../ui/use-toast'

interface VotesProps {
  type: string
  itemId: string
  userId: number
  upvotes: number
  hasupVoted: boolean
  downvotes: number
  hasdownVoted: boolean
  hasSaved?: boolean
}

const Votes: FC<VotesProps> = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  hasSaved,
}) => {
  const pathname = usePathname()
  const router = useRouter()

  const handleSave = async () => {
    await toggleSaveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    })
    toast({
      title: `Question ${
        !hasSaved ? 'Saved in' : 'Removed from'
      } your collection`,
      variant: !hasSaved ? 'default' : 'destructive',
    })
  }
  const handleVote = async (action: string) => {
    if (!userId)
      return toast({
        title: 'Please log in',
        description: 'You must be logged in to perform this action',
        variant: 'destructive',
      })
    if (action === 'upvote') {
      if (type === 'Question') {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted,
          hasupVoted,
          path: pathname,
        })
      } else if (type === 'Answer') {
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted,
          hasupVoted,
          path: pathname,
        })
      }

      // todo: show a toast
      return toast({
        title: `Upvote ${!hasupVoted ? 'Successfull' : 'Removed'}`,
        variant: !hasupVoted ? 'default' : 'destructive',
      })
    }
    if (action === 'downvote') {
      if (type === 'Question') {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted,
          hasupVoted,
          path: pathname,
        })
      } else if (type === 'Answer') {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasdownVoted,
          hasupVoted,
          path: pathname,
        })
      }

      // todo: show a toast
      return toast({
        title: `Downvote ${!hasupVoted ? 'Successful' : 'Removed'}`,
        variant: !hasupVoted ? 'default' : 'destructive',
      })
    }
  }

  // Views: When some one viewed
  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    })
  }, [itemId, userId, pathname, router])

  return (
    <div className="flex gap-5">
      <div className="flex items-center justify-center gap-2.5">
        <div className="flex items-center justify-center gap-1.5">
          <Image
            src={
              hasupVoted
                ? '/assets/icons/upvoted.svg'
                : '/assets/icons/upvote.svg'
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote('upvote')}
          />
          <div className="flex min-w-[18px] items-center justify-center rounded-sm p-1 ">
            <p className="font-semibold">{upvotes}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 5">
          <Image
            src={
              hasdownVoted
                ? '/assets/icons/downvoted.svg'
                : '/assets/icons/downvote.svg'
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote('downvote')}
          />
          <div className="flex min-w-[18px] items-center justify-center rounded-sm p-1 ">
            <p className="font-semibold">{downvotes}</p>
          </div>
        </div>
      </div>
      {type === 'Question' && (
        <Image
          src={
            hasSaved
              ? '/assets/icons/star-filled.svg'
              : '/assets/icons/star-red.svg'
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  )
}

export default Votes
