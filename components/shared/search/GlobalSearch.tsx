import { FC } from 'react'
import Search from '../../../public/assets/icons/search.svg'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
interface GlobalSearchProps {}

const GlobalSearch: FC<GlobalSearchProps> = () => {
  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden ">
      <div className=" relative flex min-h-[56px] flex-grow items-center gap-1 rounded-xl px-4">
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
          value={''}
          className="outline-none border-none ml-2"
        />
      </div>
    </div>
  )
}

export default GlobalSearch
