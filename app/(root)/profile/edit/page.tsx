import Profile from '@/components/forms/Profile'
import Question from '@/components/forms/Question'
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserByID } from '@/lib/actions/user.action'
import { ParamsProps } from '@/types'
import { FC } from 'react'

const page: FC<ParamsProps> = async ({ params }) => {
  // const {userId} = auth();
  const userId = '12346'
  if (!userId) return

  const mongoUser = await getUserByID({ userId })
  const result = await getQuestionById({ questionId: params.id })

  return (
    <>
      <h1 className="font-bold text-xl">Edit Profile</h1>
      <div className="mt-9">
        <Profile userId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  )
}

export default page
