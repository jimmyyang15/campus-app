"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/app/_components/ui/checkbox";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { api } from "@/trpc/react";
import { pdf } from "@react-pdf/renderer";
import { useParams } from "next/navigation";
import PdfComponent from "./pdf-document";
import { PDFDocument } from "pdf-lib";
import moment from "moment";
import { toast } from "sonner";
export type Certificate = {
  id: string;
  profilePicture: string;
  userId: string;
  fullName: string;
};

export const columns: ColumnDef<Certificate>[] = [
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
      )
    }

      
    
  },

  {
    id: "actions",
    header: function ActionHeader({ column })  {
      const { mutateAsync: sendCertificate } =
        api.certificate.sendCertificate.useMutation();
      const { id } = useParams();
      const [isSending, setIsSending] = useState<boolean>(false);
      const { data: membersWithoutCertificate } =
        api.certificate.getMembersWithoutCertificate.useQuery({
          clubId: id as string,
        });
      const { data: club } = api.club.singleClub.useQuery({
        id: id as string,
      });
      const { edgestore } = useEdgeStore();
      const handleSend = async () => {
        setIsSending(true);

        try {

          const promises = membersWithoutCertificate?.members.map((member) => {

            async function sendCertificatePromise() {
              try {
                const blob = await pdf(
                  <PdfComponent
                    name={member.profile?.fullName as string}
                    clubName={club?.name as string}
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
                const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
                const compressedFile = new File([pdfBytes], file.name, {
                  type: file.type,
                });
                console.log(file);
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
                });
              } catch (error) {
                throw new Error("Something went wrong");
              }
            }
            sendCertificatePromise();
          });
          await Promise.all(promises as void[]);
        } catch (error) {
          console.error(error)
        }finally{
          setIsSending(false)
        }
      };
      return (
        <div className="flex justify-end">
          <Button variant={"outline"} onClick={handleSend} disabled={isSending}>
            {isSending ? "Sending..." : "Send to all"}
          </Button>
        </div>
      );
    },
    size: 300,

    cell: function AcrtionComponent({ row }) {
      const { id } = useParams();

      const [sendingCertificate, setSendingCertificate] =
        useState<boolean>(false);
      const { edgestore } = useEdgeStore();
      const { data: club } = api.club.singleClub.useQuery({
        id: id as string,
      });
      const { mutateAsync: sendCertificate } =
        api.certificate.sendCertificate.useMutation();
      const handleGenerate = async (name: string) => {
        const blob = await pdf(
          <PdfComponent name={name} clubName={club?.name as string} />,
        ).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      };

      const handleSendCertificate = async (
        name: string,
        recipientId: string,
      ) => {
        try {
          setSendingCertificate(true);
          const blob = await pdf(
            <PdfComponent name={name} clubName={club?.name as string} />,
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
          await sendCertificate({
            file: res.url,
            recipientId,
          });
        } catch (error) {
          console.error(error);
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
            disabled={sendingCertificate}
            className="h-8 text-sm"
            onClick={() =>
              handleSendCertificate(row.original.fullName, row.original.userId)
            }
          >
            {sendingCertificate ? "Sending..." : "Send"}
          </Button>
        </div>
      );
    },
  },
];
