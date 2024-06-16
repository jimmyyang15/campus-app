import { RequestWithPayload } from '@/types'
import React from 'react'
import { Button } from '../ui/button'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import moment from 'moment'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const RequestItem = ({request}:{request:RequestWithPayload}) => {
  const queryClient = useQueryClient()  
  const { mutateAsync:acceptRequest,isLoading:isAccepting } = useMutation({
    mutationFn:(payload:{
      id:string,
      userId:string
    })=>axios.post(`/api/clubs/${request.clubId}/requests/accept-request`,payload),
    onSuccess: () => {
      toast.success("User joined", {
        description: moment().format("LLLL"),
        // action: {
        //   label: "Dismiss",
        //   onClick: () => toast.dismiss(),
        // },
        closeButton: true,
      });

    },
    onSettled:() => {
      queryClient.invalidateQueries(['requestsList'])
    }
  });
  const { mutateAsync:dissmissRequest,isLoading:isDismissing} = useMutation({
    mutationFn:(payload:{id:string})=>axios.post(`/api/clubs/${request.clubId}/requests/decline-request`,payload),
    onSuccess: () => {
      toast.success("Dismissed", {
        description: moment().format("LLLL"),
        // action: {
        //   label: "Dismiss",
        //   onClick: () => toast.dismiss(),
        // },
        closeButton: true,
      });

    },
    onSettled:() => {
      queryClient.invalidateQueries(['requestsList'])

    }
  });
  const handleAccept = async() => {
    await acceptRequest({
      userId:request.userId,
      id:request.id
    });
  };

  const handleDismiss = async() => {
    await dissmissRequest({
      id:request.id
    })
  }
  return (
    <div className='p-4 border rounded-lg'>
        <p className='text-sm text-gray-500'>{request.user.profile?.fullName} requested to join the club</p>
        <div className='flex gap-x-2  mt-2'>
        <Button className='h-8' onClick={handleAccept} disabled={isAccepting}>
          {isAccepting ? "Processing..." : "Accept"}
        </Button>
        <Button className='h-8' onClick={handleDismiss} disabled={isDismissing}>
          {isDismissing ? "Processing..." : "Dismiss"}
        </Button>
        </div>

    </div>
  )
}

export default RequestItem