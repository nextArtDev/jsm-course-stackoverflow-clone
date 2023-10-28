'use client'
import { HomePageFilters } from '@/constants'
import { FC } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface HomeFiltersProps {}

const HomeFilters: FC<HomeFiltersProps> = ({}) => {
  const isActive = 'frequent'
  return (
    <section className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => {}}
          className={cn(
            'rounded-lg px-6 py-3 capitalize shadow-none',
            isActive === item.value
              ? ' bg-gradient-to-tr from-slate-600 via-gray-800 to-slate-800 shadow-inner shadow-slate-200'
              : ''
          )}
        >
          {item.name}
        </Button>
      ))}
    </section>
  )
}

export default HomeFilters
