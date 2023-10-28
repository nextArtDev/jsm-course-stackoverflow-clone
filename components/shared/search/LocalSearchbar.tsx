'use client'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { FC } from 'react'

interface LocalSearchbarProps {
  route: string
  iconPosition: string
  imgSrc: string
  otherClasses?: string
  placeholder?: string
}

const LocalSearchbar: FC<LocalSearchbarProps> = ({
  route,
  iconPosition,
  imgSrc,
  otherClasses,
  placeholder,
}) => {
  return (
    <article
      className={cn(
        ' bg-gradient-to-tr from-slate-700 via-slate-900 to-slate-500 flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 shadow-inner shadow-sm shadow-slate-400 ',
        otherClasses
      )}
    >
      {iconPosition === 'left' && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={''}
        onChange={() => {}}
        className="border-none bg-gradient-to-tr from-slate-700 via-slate-900 to-slate-500 text-slate-200 shadow-sm shadow-slate-400 outline-none placeholder:text-slate-300 "
      />
      {iconPosition === 'right' && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </article>
  )
}

export default LocalSearchbar
