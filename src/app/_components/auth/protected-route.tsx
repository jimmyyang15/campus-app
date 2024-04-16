"use client"

import { User } from 'lucia'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const ProtectedRoute = ({ children,user }: { children: React.ReactNode,user:User|null }) => {
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
    }
  }, [router])

  // if (!user) return null

  return <>{children}</>
}

export default ProtectedRoute