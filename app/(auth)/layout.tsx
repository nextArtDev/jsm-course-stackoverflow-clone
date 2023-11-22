import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="min-h-screen w-full text-white ">{children}</section>
  )
}
