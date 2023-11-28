import Question from '@/components/forms/Question'
import { getCurrentUser } from '@/lib/actions/getCurrentUser'
// import { getUserByID } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const page = async (props: Props) => {
  const currentUser = await getCurrentUser()

  const userId = currentUser?.id
  // we should get it from clerk
  if (!userId) redirect('/sign-in')

  // const mongoUser = await getUserByID({ userId })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-200"> سوال بپرسید</h1>
      <div className="mt-9">
        <Question userId={JSON.stringify(userId)} />
        {/* <Question mongoUserId={JSON.stringify(mongoUser._id)} /> */}
      </div>
    </div>
  )
}

export default page
