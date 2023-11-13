'use client'
import { Button } from '@/components/ui/button'
import { GlobalSearchFilters } from '@/constants'
import { cn, fromUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useState } from 'react'

interface GlobalFiltersProps {}

const GlobalFilters: FC<GlobalFiltersProps> = ({}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const typeParams = searchParams.get('type')
  const [active, setActive] = useState(typeParams || '')

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive('')
      const newUrl = fromUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: null,
      })
      router.push(newUrl, { scroll: false })
    } else {
      setActive(item)
      const newUrl = fromUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: item.toLowerCase(),
      })
      router.push(newUrl, { scroll: false })
    }
  }
  return (
    <div className="flex items-center gap-5 px-5">
      <p className="font-semibold">Type:</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((item) => (
          <Button
            key={item.value}
            onClick={() => handleTypeClick(item.value)}
            className={cn(
              `rounded-full hover:text-slate-500 hover:bg-none`,
              active === item.value
                ? 'bg-rose-400 text-slate-200 hover:text-slate-500 hover:bg-non'
                : ''
            )}
            variant={'outline'}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default GlobalFilters
