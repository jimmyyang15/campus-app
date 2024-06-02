"use client"

import { api } from '@/trpc/react'
import { useParams } from 'next/navigation'
import React from 'react'
import Loading from '../loading'
import { DataTable } from './data-table'
import { Submission, columns } from './columns'
import { ColumnDef } from '@tanstack/react-table'

const SubmissionList = () => {
    const { id,assignmentId } = useParams()
    const { data:submissions } = api.submission.getSubmissions.useQuery({
        assignmentId:assignmentId as string
    });
    const { data: club, isLoading } = api.club.singleClub.useQuery({
      id: id as string,
    });

    const members = club?.members.filter((member)=>!member.isMentor);
    const findSubmission = (userId: string) =>{
      return submissions?.find((submission)=>submission.userId === userId)
    }
    const mappedMembers = members?.map((member)=>{
      return {
        // id:member.id,
        status:findSubmission(member.id) ? ((findSubmission(member.id)?.createdAt?.getTime() as number)  >= (findSubmission(member.id)?.assignment?.createdAt!.getTime() as number)) ? "Overdue" : "Submitted" : "Not Attempted",
        username:member.username,
        name:member.profile?.fullName,
        file:findSubmission(member.id) ? findSubmission(member.id)?.files.split("/").pop() :"-"
      }
    })
  
  return (
    <div>
        {isLoading || !club?.members ? <Loading /> :<div>
        <DataTable columns={columns} data={mappedMembers as Submission[]} />
            </div>}
    </div>
  )
}

export default SubmissionList