'use client'

import React from 'react'
import { Separator } from '../ui/separator'


import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
const AccountLayout = () => {
  const pathname = usePathname()
    return (
    <div>

        <ul className='space-y-2 flex-[.2] md:flex-[.3]'>
            <li className={cn(`font-semibold p-2 px-4 rounded-lg `,{
                "bg-accent" : pathname.includes("profile")
            })}>
                <Link href="/account/profile" className='w-full'>Profile</Link>
            </li>
            <li className={cn('font-semibold py-2 px-4 rounded-lg w-full' ,{
                "bg-accent" : pathname.includes("change-password")

            })}>
                <Link href="/account/change-password" >Change Password</Link>
            </li>
        </ul>
    </div>
  )
}

export default AccountLayout