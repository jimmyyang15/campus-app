

import Link from 'next/link'
import React from 'react'
import { Separator } from '../_components/ui/separator'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import AccountLayout from '../_components/account/account-layout'

const LayoutAccount = ({children}:{children:React.ReactNode}) => {

    return (
    <main className='p-4 '>
                <h3>Account</h3>
        <p>
        
        Manage your account settings
        </p>
        <Separator className='my-4' />
        <div className='flex gap-x-4 '>
        <AccountLayout />
        {children}
        </div>
        

    </main>
  )
}

export default LayoutAccount