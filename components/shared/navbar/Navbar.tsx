import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import SiteLogo from '../../../public/assets/images/site-logo.svg'
import Theme from './Theme'
import MobileNav from './MobileNav'
import GlobalSearch from '../search/GlobalSearch'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav className=" bg-gray-900 flex justify-between items-center fixed z-50 w-full gap-5 dark:shadow-none sm:px-12 border-b border-gray-700 ">
      <Link href={'/'} className="flex items-center gap-1">
        <Image src={SiteLogo} width={23} height={23} alt="DevFlow" />
        <p className="font-bold font-spaceGrotesk max-sm:hidden text-white/50 ">
          Dev <span className="text-secondary">Overflow</span>{' '}
        </p>
      </Link>
      <GlobalSearch />
      <div className="flex-between gap-5">
        <Theme />
        <MobileNav />
      </div>
    </nav>
  )
}

export default Navbar
