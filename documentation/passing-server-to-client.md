# JSON.parse and JSON.stringify

to pass an object from a server component to a client component, we have to first __JSON.stringify__ that and then __JSON.pars__ it

```typescript
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
      //parsing that in server component
        <Profile userId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  )
}


'use client'

import { FC } from 'react'

interface ProfileProps {
  userId
  user
}

const Profile: FC<ProfileProps> = ({ userId, user }) => {
    // Getting that in client component
  const parsedUser = JSON.parse(user)
  return <div>Profile</div>
}

export default Profile

```
