'use client'
import { FC, useEffect, useState } from 'react'
import Search from '../../../public/assets/icons/search.svg'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { fromUrlQuery, removeKeysFromUrlQuery } from '@/lib/utils'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import GlobalResult from './GlobalResult'
interface GlobalSearchProps {}

const GlobalSearch: FC<GlobalSearchProps> = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const query = searchParams.get('q')

  const [search, setSearch] = useState(query || '')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = fromUrlQuery({
          params: searchParams.toString(),
          key: 'global',
          value: search,
        })
        router.push(newUrl, { scroll: false })
      } else {
        if (query) {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ['global', 'type'],
          })
          // to not scroll to top of the page
          router.push(newUrl, { scroll: false })
        }
      }
    }, 300)
    return clearTimeout(delayDebounceFn)
  }, [search, router, pathname, searchParams, query])

  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden ">
      <div className=" relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4 ">
        <Image
          src={Search}
          alt="Search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search globally"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)

            if (!isOpen) setIsOpen(true)
            if (e.target.value === '' && isOpen) setIsOpen(false)
          }}
          className="ml-2 border-none text-slate-200 outline-none "
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  )
}

export default GlobalSearch
