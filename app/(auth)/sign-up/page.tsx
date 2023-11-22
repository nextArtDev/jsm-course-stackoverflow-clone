import SignUp from '@/components/auth/SignUp'

import { FC } from 'react'

const page: FC = () => {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20 pt-8 ">
      <SignUp />
    </div>
  )
}

export default page
