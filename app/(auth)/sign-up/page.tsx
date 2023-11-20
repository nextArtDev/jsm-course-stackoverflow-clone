import SignUp from '@/components/auth/SignUp'

import { FC } from 'react'

const page: FC = () => {
  return (
    <div className="pt-8 h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20 ">
      <SignUp />
    </div>
  )
}

export default page
