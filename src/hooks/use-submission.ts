import { useSession } from "@/app/_components/session-provider";
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "@/trpc/react";
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
    const { assignmentId } = useParams();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const { user } = useSession();
    const { edgestore } = useEdgeStore();
    const utils = api.useUtils();

    const { data: assignment, isLoading } = api.assignment.getAssignment.useQuery(
        {
            assignmentId: assignmentId as string,
        },
    );
    const submission = assignment?.submissions.find(
        (item) => item.userId === user.id,
    );
    console.log(submission);
    const { mutateAsync: submitAssignment } =
        api.assignment.submitAssignment.useMutation({

            onSettled: () => {
                utils.assignment.getAssignment.invalidate({
                    assignmentId: assignmentId as string,
                });
            },
        });

    const { mutateAsync: editSubmission } = api.assignment.editSubmission.useMutation({
        onSettled: () => {
            utils.assignment.getAssignment.invalidate({
                assignmentId: assignmentId as string,

            })
        }
    });
    const { mutateAsync: removeSubmission } = api.assignment.removeSubmission.useMutation({
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
            utils.assignment.getAssignment.invalidate({
                assignmentId: assignmentId as string,

            })
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
                assignmentId: assignmentId as string,
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
                assignmentId: assignmentId as string
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
            await removeSubmission({
                submissionId: submission?.id as string
            })
        } catch (error) {
            throw new Error("Something went wrong!")
        } finally {
            setIsRemoving(false)
        }
    }

    return { submission, assignment, handleRemoveSubmission,handleEditSubmission,onSubmit,setSelectedFile,selectedFile,isSubmitting,isEditing,isRemoving,isLoading }

}