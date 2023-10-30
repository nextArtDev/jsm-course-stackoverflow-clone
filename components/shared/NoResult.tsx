import Image from 'next/image'
import { FC } from 'react'
import darkIllustration from '../../public/assets/images/dark-illustration.png'
import Link from 'next/link'
import { Button } from '../ui/button'

interface NoResultProps {
  title: string
  description: string
  link: string
  linkTitle: string
}

const NoResult: FC<NoResultProps> = ({
  title,
  description,
  link,
  linkTitle,
}) => {
  return (
    <section className=" mt-10 flex flex-col w-full items-center justify-center text-slate-300 ">
      <Image
        src={darkIllustration.src}
        alt="no results"
        width={270}
        height={200}
        className="object-contain flex "
      />
      <h2 className="mt-4 text-2xl font-bold text-slate-200 ">{title}</h2>
      <p className="my-3.5 max-w-md">{description}</p>
      <Link href={link} className="">
        <Button className="metalize transition duration-1000 ">
          {linkTitle}
        </Button>
      </Link>
    </section>
  )
}

export default NoResult
