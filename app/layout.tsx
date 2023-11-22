import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import '../styles/prism.css'
// import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'
import { ThemeProvider } from '@/context/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import localFont from 'next/font/local'

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
})
const numericFont = localFont({
  src: '../public/fonts/FarsiAdad.woff2',
  variable: '--font-adad',
})
const numericBoldFont = localFont({
  src: '../public/fonts/FarsiAdad-Bold.woff2',
  variable: '--font-adad-bold',
})
const numericRegularFont = localFont({
  src: '../public/fonts/FarsiAdad-Regular.woff2',
  variable: '--font-adad-reg',
})
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spaceGrotesk',
})
const primaryFont = localFont({
  src: '../public/fonts/FarsiFont.woff2',
  variable: '--font-sans',
})
const SnapWebReg = localFont({
  src: '../public/fonts/SnappWeb2.0-Regular.woff',
  variable: '--font-snappReg',
})
const Anjoman = localFont({
  src: '../public/fonts/AnjomanVariableGX.ttf',
  variable: '--font-anjoman',
})

export const metadata: Metadata = {
  title: 'DevFlow',
  description:
    'A community-driven platform for asking and answering programming questions',
  // Changing the fav-icon
  icons: {
    icon: '/assets/images/site-logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <ClerkProvider>
    <html lang="fa-IR" dir="rtl">
      {/* <body
        className={`backgroundShape ${inter.variable} ${spaceGrotesk.variable}  `}
      > */}
      <body
        className={`${primaryFont.variable} ${Anjoman.variable} ${SnapWebReg.variable} font-snappReg adad  antialiased  `}
      >
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          ></ThemeProvider>
          <div className="" />
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
    // </ClerkProvider>
  )
}
