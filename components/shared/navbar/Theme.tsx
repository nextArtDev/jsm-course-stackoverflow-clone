'use client'
import Sun from '../../../public/assets/icons/sun.svg'
import Moon from '../../../public/assets/icons/moon.svg'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { useTheme } from '@/context/ThemeProvider'
import Image from 'next/image'
import React from 'react'
import { themes } from '@/constants'

const Theme = () => {
  const { mode, setMode } = useTheme()
  return (
    <Menubar className="relative border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-black/40 data-[state=open]:bg-gray-700 ">
          {mode === 'light' ? (
            <Image
              src={Sun}
              alt="Sun"
              width={20}
              height={20}
              className="active-theme"
            />
          ) : (
            <Image
              src={Moon}
              alt="Moon"
              width={20}
              height={20}
              className="active-theme"
            />
          )}
        </MenubarTrigger>
        <MenubarContent className=" absolute right-2 mt-3 min-w-[120px] rounded border py-2  ">
          {themes.map((item) => (
            <MenubarItem
              key={item.value}
              onClick={() => {
                setMode(item.value)

                if (item.value !== 'system') {
                  localStorage.theme = item.value
                } else {
                  localStorage.removeItem('theme')
                }
              }}
              className="flex justify-between gap-4 px-2.5 py-2"
            >
              <Image
                src={item.icon}
                alt={item.value}
                width={16}
                height={16}
                className={`${mode === item.value && 'active-theme'}`}
              />
              <p
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className={`body-semibold text-gray-800 dark:text-gray-300  ${
                  mode === item.value ? 'text-white/80 ' : 'text-white/60  '
                }`}
              >
                {item.label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default Theme
