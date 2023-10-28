'use client'
import { cn } from '@/lib/utils'
import { FC } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FilterProps {
  filters: { name: string; value: string }[]
  otherClasses?: string
  containerClasses?: string
}

const Filter: FC<FilterProps> = ({
  filters,
  otherClasses,
  containerClasses,
}) => {
  return (
    <article className={cn('relative')}>
      <Select>
        <SelectTrigger
          className={cn(
            'bg-gradient-to-tr from-slate-700 via-slate-900 to-slate-500 text-slate-200 shadow-sm shadow-slate-400 outline-none placeholder:text-slate-300',
            otherClasses
          )}
        >
          <div className="line-clamp-1 flex-1 text-left ">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-gradient-to-tr from-slate-700 via-slate-900 to-slate-500 text-slate-200">
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </article>
  )
}

export default Filter
