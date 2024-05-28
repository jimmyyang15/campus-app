"use client"

import React from 'react'
import { Button } from '../ui/button'
import { useSession } from '../session-provider'
import { api } from '@/trpc/react'
import { useParams } from 'next/navigation'

const SendNotificationBtn = () => {
        const { id } = useParams()
    const { mutateAsync:notifyMentor } = api.notification.sendNotificationToMentor.useMutation({
        
    })

    const handleNotify = async() => {
        await notifyMentor({
            clubId:id as string
        });
    }
  return (
    <Button onClick={handleNotify}>
        Notify mentor
    </Button>
  )
}

export default SendNotificationBtn