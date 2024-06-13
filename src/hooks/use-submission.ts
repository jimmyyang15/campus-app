import { useSession } from "@/app/_components/session-provider";
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "@/trpc/react";
import { AssignmentWithPayload } from "@/types";
import { Assignment } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const SubmissionSchema = z.object({
    attachment: z.instanceof(File, {
        message: "Required",
    }),
});
type SubmissionSchemaType = z.infer<typeof SubmissionSchema>;
export const useSubmission = () => {
    const { assignmentId, id } = useParams();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const user = useSession();
    const { edgestore } = useEdgeStore();
    const queryClient = useQueryClient()
    const { data: assignment, isLoading } = useQuery<{
        data: AssignmentWithPayload
    }>({
        queryKey: ['assignment'],
        queryFn: () =>
            fetch(`/api/clubs/${id}/assignments/${assignmentId}`).then((res) =>
                res.json(),
            ),
    })
    const submission = assignment?.data.submissions.find(
        (item) => item.userId === user.id,
    );
    console.log(submission);
    const { mutateAsync: submitAssignment } = useMutation({
        mutationFn: (payload: {
            file:string
        },
        
        ) => axios.post(`/api/clubs/${id}/assignments/${assignmentId}/submissions`, payload),
        onSuccess: () => {
            toast.success("Assignment submitted", {
                description: moment().format("LLLL"),
                // action: {
                //   label: "Dismiss",
                //   onClick: () => toast.dismiss(),
                // },
                closeButton: true,
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries(['assignment'])
        },
    });

    const { mutateAsync: editSubmission } = useMutation({
        mutationFn:(payload: {
            file:string
        })=>axios.put(`/api/clubs/${id}/assignments/${assignmentId}/submissions/${submission?.id}`,payload),
        onSettled: () => {
            queryClient.invalidateQueries(['assignment'])

        }
    });
    const { mutateAsync: removeSubmission } = useMutation({
        mutationFn:()=>axios.delete(`/api/clubs/${id}/assignments/${assignmentId}/submissions/${submission?.id}`),
        onSuccess: () => {
            toast.success("File removed", {
                description: moment().format("LLLL"),
                // action: {
                //   label: "Dismiss",
                //   onClick: () => toast.dismiss(),
                // },
                closeButton: true,
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries(['assignment'])

        }
    });
    const onSubmit = async (values: SubmissionSchemaType) => {
        const { attachment } = values;
        try {
            setIsSubmitting(true);
            const res = await edgestore.publicFiles.upload({
                file: attachment,

                options: {

                    manualFileName: attachment.name as string,
                },
                // input:{
                //   name:file.name
                // }
                // onProgressChange: (progress) => {
                //   // you can use this to show a progress bar
                //   console.log(progress);
                // },
            });
            await submitAssignment({
                file: res.url,
            });
        } catch (err) {
            console.log(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditSubmission = async () => {
        try {
            setIsEditing(true)
            const res = await edgestore.publicFiles.upload({
                file: selectedFile as File,
                options: {
                    replaceTargetUrl: submission?.files,
                    manualFileName: selectedFile?.name
                },
                // ...
            });
            await editSubmission({
                file: res.url,
            })
        } catch (error) {
            throw new Error("Something went wrong!")
        } finally {
            setIsEditing(false)
            setSelectedFile(null)
        }

    }

    const handleRemoveSubmission = async () => {
        try {
            setIsRemoving(true)
            await edgestore.publicFiles.delete({
                url: submission?.files as string,
            });
            await removeSubmission()
        } catch (error) {
            throw new Error("Something went wrong!")
        } finally {
            setIsRemoving(false)
        }
    }

    return { submission, assignment: assignment?.data, handleRemoveSubmission, handleEditSubmission, onSubmit, setSelectedFile, selectedFile, isSubmitting, isEditing, isRemoving, isLoading }

}