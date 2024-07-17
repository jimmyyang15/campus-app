"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { useParams } from "next/navigation";
import PdfComponent from "./pdf-document";
import { PDFDocument } from "pdf-lib";
import moment from "moment";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AssignmentWithPayload,
  ClubWithPayload,
  ExtendedAssignment,
  UserWithProfile,
} from "@/types";
import { User } from "lucia";
import axios, { AxiosError } from "axios";
import { Certificate } from "@prisma/client";
export type CertificateColumn = {
  id: string;
  profilePicture: string;
  userId: string;
  fullName: string;
  email: string;
};

export const columns: ColumnDef<CertificateColumn>[] = [
  //   {
  //     id: "select",
  //     header: ({ table }) => (
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //     ),
  //     cell: ({ row }) => (
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     ),
  //     enableSorting: false,
  //     enableHiding: false,
  //   },

  {
    accessorKey: "fullName",
    header: function FullNameHeaderComponent({ column }) {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: function FullNameCellComponent({ row }) {
      return (
        <div className="flex items-center gap-x-2">
          <Avatar>
            <AvatarImage
              alt="@shadcn"
              src={
                row.original.profilePicture
                  ? row.original.profilePicture
                  : `https://ui-avatars.com/api/?background=random&name=${row.getValue("fullName")}`
              }
              className="object-cover"
            />
            <AvatarFallback>
              <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200"></div>
            </AvatarFallback>
          </Avatar>
          <p>{row.getValue("fullName")}</p>
        </div>
      );
    },
  },

  {
    id: "actions",
    header: function ActionHeader({ column }) {
      const queryClient = useQueryClient();
      const { mutateAsync: sendCertificate } = useMutation({
        mutationFn: (payload: {
          file: string;
          recipientId: string;
          email: string;
        }) => axios.post(`/api/certificates/send-certificate`, payload),
        onSettled: () => {
          // queryClient.invalidateQueries(["memberCertificate"]);
        },
      });
      const { data: assignments } = useQuery<{
        data: AssignmentWithPayload[];
      }>({
        queryKey: ["assignmentList"],
        queryFn: () =>
          fetch(`/api/clubs/${id}/assignments`).then((res) => res.json()),
      });
      const { id } = useParams();
      const [isSending, setIsSending] = useState<boolean>(false);
      const { data: membersWithoutCertificate, isLoading } = useQuery<{
        data: {
          members: UserWithProfile[];
        };
      }>({
        queryKey: ["usersWithoutCertificate"],
        queryFn: () =>
          fetch(`/api/clubs/${id}/members/without-certificate`).then((res) =>
            res.json(),
          ),
      });
      const { data: club } = useQuery<{
        data: ClubWithPayload;
      }>({
        queryKey: ["clubHome"],
        queryFn: () => fetch(`/api/clubs/${id}`).then((res) => res.json()),
      });
      const mentor = club?.data.members.find((member) => member.isMentor)
        

      const { edgestore } = useEdgeStore();
      const handleSend = async () => {
        setIsSending(true);

        try {
          const promises = membersWithoutCertificate?.data.members.map(
            (member) => {
              const mappedAssignments = assignments?.data.filter((assignment) =>
                assignment.submissions.filter(
                  (submission) => submission.userId === member.id,
                ),
              );

              async function sendCertificatePromise() {
                try {
                  const blob = await pdf(
                    <PdfComponent
                      date={moment(new Date()).format("LL")}
                      mentorName={mentor?.profile?.fullName as string}
                      mentorSign={mentor?.signature as string}
                      assignments={mappedAssignments as ExtendedAssignment[]}
                      name={member.profile?.fullName as string}
                      clubName={club?.data.name as string}
                    />,
                  ).toBlob();
                  const file = new File(
                    [blob],
                    `${member.profile?.fullName}.pdf`,
                    {
                      type: "application/pdf",
                    },
                  );
                  const arrayBuffer = await file.arrayBuffer();
                  const pdfDoc = await PDFDocument.load(arrayBuffer);
                  const pdfBytes = await pdfDoc.save({
                    useObjectStreams: false,
                  });
                  const compressedFile = new File([pdfBytes], file.name, {
                    type: file.type,
                  });
                  const res = await edgestore.publicFiles.upload({
                    options: {
                      manualFileName: `${member.profile?.fullName} Certificate.pdf`,
                    },
                    file: compressedFile,

                    onProgressChange: (progress) => {
                      // you can use this to show a progress bar
                      console.log(progress);
                    },
                  });
                  await sendCertificate({
                    file: res.url,
                    recipientId: member.id,
                    email: member.email,
                  });
                } catch (error) {
                  throw new Error("Something went wrong");
                }
              }
              sendCertificatePromise();
            },
          );
          await Promise.all(promises as void[]);
        } catch (error) {
          console.error(error);
        } finally {
          setIsSending(false);
          toast.success("Certificates sent!", {
            description: moment().format("LLLL"),
            // action: {
            //   label: "Dismiss",
            //   onClick: () => toast.dismiss(),
            // },
            closeButton: true,
          });
        }
      };
      return (
        <div className="flex justify-end">
          <Button
            variant={"outline"}
            onClick={handleSend}
            className="text-white"
            disabled={
              isSending || membersWithoutCertificate?.data.members.length === 0
            }
          >
            {isSending ? "Sending certificates" : "Send to all"}
          </Button>
        </div>
      );
    },
    size: 300,

    cell: function ActionComponent({ row }) {
      const { id } = useParams();
      const queryClient = useQueryClient();
      const [sendingCertificate, setSendingCertificate] =
        useState<boolean>(false);
      const { edgestore } = useEdgeStore();
      const { data: assignments } = useQuery<{
        data: AssignmentWithPayload[];
      }>({
        queryKey: ["userSubmissions", row.original.userId],
        queryFn: () =>
          fetch(
            `/api/clubs/${id}/${row.original.userId}/user-submissions`,
          ).then((res) => res.json()),
      });
      const mappedAssignments = assignments?.data.map((assignment) => {
        return {
          ...assignment,
          mark: assignment.submissions.find(
            (submission) => submission.assignmentId === assignment.id,
          )?.mark,
        };
      });

      console.log();
      const { data: certificate } = useQuery<{
        data: Certificate;
      }>({
        queryKey: ["memberCertificate", row.original.userId],
        queryFn: () =>
          fetch(
            `/api/certificates/member-certificate/${row.original.userId}`,
          ).then((res) => res.json()),
        enabled: !!row.original.userId,
      });

      const { data: club } = useQuery<{
        data: ClubWithPayload;
      }>({
        queryKey: ["clubHome"],
        queryFn: () => fetch(`/api/clubs/${id}`).then((res) => res.json()),
      });
      const mentor = club?.data.members.find((member) => member.isMentor);
      // const mentorName = club?.data.members.find((member) => member.isMentor)
      //   ?.profile?.fullName;
      // const { mutateAsync: sendCertificate } =
      //   api.certificate.sendCertificate.useMutation();
      const { mutateAsync: sendCertificate } = useMutation({
        mutationFn: (payload: {
          file: string;
          recipientId: string;
          email: string;
        }) => axios.post(`/api/certificates/send-certificate`, payload),
        onSettled: () => {
          // queryClient.invalidateQueries(["memberCertificate"]);
        },
      });
      const handleGenerate = async (name: string) => {
        const blob = await pdf(
          <PdfComponent
            date={moment().format("LL")}
            mentorName={mentor?.profile?.fullName as string}
            mentorSign={mentor?.signature as string}
            assignments={mappedAssignments as ExtendedAssignment[]}
            name={name}
            clubName={club?.data.name as string}
          />,
        ).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      };

      // console.log("test", row.original.userId, !!certificate?.data)

      const handleSendCertificate = async (
        name: string,
        recipientId: string,
        email: string,
      ) => {
        try {
          setSendingCertificate(true);
          const blob = await pdf(
            <PdfComponent
              date={moment().format("LL")}
              mentorSign={mentor?.signature as string}
              mentorName={mentor?.profile?.fullName as string}
              assignments={mappedAssignments as ExtendedAssignment[]}
              name={name}
              clubName={club?.data.name as string}
            />,
          ).toBlob();
          const file = new File([blob], `${name}.pdf`, {
            type: "application/pdf",
          });
          console.log(file);
          const res = await edgestore.publicFiles.upload({
            options: {
              manualFileName: `${name} Certificate.pdf`,
            },
            file,

            onProgressChange: (progress) => {
              // you can use this to show a progress bar
              console.log(progress);
            },
          });
          console.log(res);

          await sendCertificate({
            file: res.url,
            recipientId,
            email,
          });
        } catch (err) {
            if (axios.isAxiosError(err)) {
              toast.error(err.message, {
                description: err.response?.data,
                // action: {
                //   label: "Dismiss",
                //   onClick: () => toast.dismiss(),
                // },
                closeButton: true,
              });
              // Do something with this error...
            }
          
        } finally {
          setSendingCertificate(false);
          toast.success("Certificate sent!", {
            description: moment().format("LLLL"),
            // action: {
            //   label: "Dismiss",
            //   onClick: () => toast.dismiss(),
            // },
            closeButton: true,
          });
        }
      };
      return (
        <div className="flex items-center justify-end gap-x-2">
          <Button
            className="h-8 text-sm"
            variant={"outline"}
            onClick={() => handleGenerate(row.original.fullName)}
          >
            View
          </Button>
          <Button
            variant={"outline"}
            disabled={sendingCertificate || !!certificate?.data}
            className="h-8 text-sm"
            onClick={() =>
              handleSendCertificate(
                row.original.fullName,
                row.original.userId,
                row.original.email,
              )
            }
          >
            {sendingCertificate ? "Sending..." : "Send"}
          </Button>
        </div>
      );
    },
  },
];
