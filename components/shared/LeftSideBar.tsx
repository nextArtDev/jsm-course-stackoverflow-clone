'use client'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface LeftSideBarProps {}

const LeftSideBar: FC<LeftSideBarProps> = () => {
  const pathname = usePathname()
  return (
    <section className="bg-gray-900  border-gray-700 sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow max-sm:hidden lg:w-[266px] ">
      <div className=" flex h-full flex-col flex-1 gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route
          return (
            <Link
              key={item.route}
              href={item.route}
              className={`flex items-center justify-start gap-4 rounded-lg bg-black/20  p-4 ${
                isActive
                  ? 'rounded-lg bg-black/60 text-secondary'
                  : 'text-secondary'
              }`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={``}
              />
              <p
                className={` max-lg:hidden ${isActive ? 'font-semibold' : ''} `}
              >
                {item.label}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default LeftSideBar
