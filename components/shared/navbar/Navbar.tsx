import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import SiteLogo from '../../../public/assets/images/site-logo.svg'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 shadow-light-300 dark:shadow-none sm:px-12 ">
      <Link href={'/'} className="flex items-center gap-1">
        <Image src={SiteLogo} width={23} height={23} alt="DevFlow" />
        <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev <span className="text-primary-500">Overflow</span>{' '}
        </p>
      </Link>
      GlobalSearch
      <div className="flex-between gap-5">Theme</div>
    </nav>
  )
}

export default Navbar
