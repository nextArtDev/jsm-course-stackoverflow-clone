import Question from '@/components/forms/Question'
import { getCurrentUser } from '@/lib/actions/getCurrentUser'
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserByID } from '@/lib/actions/user.action'
import { ParamsProps } from '@/types'
import { notFound } from 'next/navigation'
import { FC } from 'react'

const page: FC<ParamsProps> = async ({ params }) => {
  // const {userId} = auth();
  const currentUser = await getCurrentUser()
  if (!currentUser) return notFound()
  const userId = currentUser.id
  if (!userId) return notFound()

  // const mongoUser = await getUserByID({ userId })
  const result = await getQuestionById({ questionId: params.id })

  return (
    <>
      <h1 className="text-xl font-bold">ویرایش سوال</h1>
      <div className="mt-9">
        <Question
          type="Edit"
          userId={userId}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  )
}

export default page
