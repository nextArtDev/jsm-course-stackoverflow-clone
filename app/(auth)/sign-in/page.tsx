import SignIn from '@/components/auth/SignIn'
import { buttonVariants } from '@/components/ui/button'

import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

const page: FC = () => {
  return (
    // <div className="absolute inset-0">
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20 ">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'self-start -mt-20 border border-white/30 text-blue-950'
        )}
      >
        <ChevronRight />
        صفحه اصلی
      </Link>

      <SignIn />
    </div>
    // </div>
  )
}

export default page
