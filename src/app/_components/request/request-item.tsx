import { RequestWithPayload } from '@/types'
import React from 'react'
import { Button } from '../ui/button'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import moment from 'moment'

const RequestItem = ({request}:{request:RequestWithPayload}) => {
  const utils = api.useUtils();
  const { mutateAsync:acceptRequest,isLoading:isAccepting } = api.request.acceptRequest.useMutation({
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
      utils.request.getRequests.invalidate({
        clubId:request.clubId
      })
    }
  });
  const { mutateAsync:dissmissRequest,isLoading:isDismissing} = api.request.dismissRequest.useMutation({
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
      utils.request.getRequests.invalidate({
        clubId:request.clubId
      })
    }
  });
  const handleAccept = async() => {
    await acceptRequest({
      clubId:request.clubId,
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