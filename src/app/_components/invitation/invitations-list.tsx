"use client";

import { api } from "@/trpc/react";
import React from "react";
import { Button } from "@/app/_components/ui/button";
import Loading from "../loading";
import { toast } from "sonner";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Invitation } from "@prisma/client";
import { InvitationWithPayload } from "@/types";

const InvitationsList = () => {
  const queryClient = useQueryClient()
  const { data:invitations,isLoading } = useQuery<{
    data:InvitationWithPayload[]
  }>({
    queryKey: ['invitationsList'],
    queryFn: () =>
      fetch(`/api/invitations`).then((res) =>
        res.json(),
      ),
  })
    const { mutateAsync: acceptInvitation,isLoading:isJoining } = useMutation({
      mutationFn:(payload:{
        clubId:string,
        invitationId:string,
      })=>axios.post(`/api/invitations/accept-invitation`,payload),
      onSuccess: () => {
        toast.success("Club joined", {
          description: moment().format("LLLL"),
          // action: {
          //   label: "Dismiss",
          //   onClick: () => toast.dismiss(),
          // },
          closeButton: true,
        });
      },
      onSettled:()=>{
        queryClient.invalidateQueries(['invitationsList'])
      }
    });
    const { mutateAsync: declineInvitation,isLoading:isDeclining } = useMutation({
      mutationFn:(payload:{
        invitationId:string,
      })=>axios.post(`/api/invitations/decline-invitation`,payload),
      onSuccess: () => {
        toast.success("Invitation declined", {
          description: moment().format("LLLL"),
          // action: {
          //   label: "Dismiss",
          //   onClick: () => toast.dismiss(),
          // },
          closeButton: true,
        });
      },
      onSettled:()=>{
        queryClient.invalidateQueries(['invitationsList'])

      }
    });
    const handleAccept = async(clubId:string,invitationId:string)=>{
      await acceptInvitation({
        clubId,
        invitationId
      })
    }
    const handleDecline = async(invitationId:string)=>{
      await declineInvitation({
        invitationId
      })
    }
  return (
    <div className="mt-4 space-y-4">
      {isLoading && !invitations ? (
        <Loading />
      ) : (
        <>
        {invitations?.data.length !== 0 ?<>
          {invitations?.data.map((invitation) => (
            <div
              key={invitation.id}
              className="space-y-2 rounded-lg border p-4"
            >
              <p className=" font-semibold">{invitation.club.name}</p>
              <p className="text-sm text-gray-500">
                {invitation.sender.profile?.fullName} invited you to join the
                club
              </p>
              <div className="flex items-center gap-x-2">
                <Button className="h-8 text-sm" variant={"outline"} disabled={isJoining} onClick={()=>handleAccept(invitation.clubId,invitation.id)}>
                  {isJoining ? "Processing..." : "Join" }
                </Button>
                <Button className="h-8 text-sm" variant={"outline"} disabled={isDeclining} onClick={()=>handleDecline(invitation.id)}>
                  {isDeclining ? "Processing..." : "Decline" } 
                </Button>
              </div>
            </div>
          ))}
        </>:<p className="text-gray-500">Nothing here</p>}
          
        </>
      )}
    </div>
  );
};

export default InvitationsList;
