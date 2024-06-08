"use client";

import { pdf } from "@react-pdf/renderer";
import React, { useMemo, useState } from "react";
import PdfDocument from "./pdf-document";
import { Button } from "../ui/button";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { api } from "@/trpc/react";
import { useEdgeStore } from "@/lib/edgestore";
import { Club } from "@prisma/client";
import { DataTable } from "./data-table";
import { Certificate, columns } from "./columns";
import Loading from "../loading";

const CertificateComponent = () => {
  const router = useRouter();
  const { id } = useParams();

  const { data, isLoading } = api.club.getMembers.useQuery({
    clubId: id as string,
  });
  const { data: club } = api.club.singleClub.useQuery({
    id: id as string,
  });

  const mappedMembers = useMemo(
    () =>
      data?.members?.map((member) => {
        return {
          id: member.id,
          profilePicture: member.profile?.profilePicture,
          userId: member.id,
          fullName: member.profile?.fullName,
        };
      }),
    [data],
  );

  console.log(mappedMembers);

  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()}>
        <ChevronLeft size={18} className="mr-2" />
        Back
      </Button>
      {/* <button onClick={handleGenerate}>Generate certificate</button> */}
      <p className="mt-4 text-xl font-semibold">Certificates</p>
      {/* <p className="text-center text-lg mt-4">
        Club members
      </p> */}
      {(isLoading || !mappedMembers)? (
        <Loading />
      ) : (
        <div className="mx-auto mt-4 flex  w-3/4 flex-col space-y-8 rounded-lg p-2">
          {/* {data?.members?.map((member)=>(
           <Item key={member.id} memberId={member.id} memberName={member.profile?.fullName as string} club={club as Club} />
        ))} */}
          <DataTable columns={columns} data={mappedMembers as unknown as Certificate[]} />
        </div>
      )}
    </div>
  );
};

const Item = ({
  memberName,
  memberId,
  club,
}: {
  memberName: string;
  memberId: string;
  club: Club;
}) => {
  const [sendingCertificate, setSendingCertificate] = useState<boolean>(false);
  const { edgestore } = useEdgeStore();

  const { mutateAsync: sendCertificate } =
    api.certificate.sendCertificate.useMutation();
  const handleGenerate = async (name: string) => {
    const blob = await pdf(
      <PdfDocument name={name} clubName={club?.name as string} />,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleSendCertificate = async (name: string, recipientId: string) => {
    try {
      setSendingCertificate(true);
      const blob = await pdf(
        <PdfDocument name={name} clubName={club?.name as string} />,
      ).toBlob();
      const file = new File([blob], `${name}.pdf`, { type: "application/pdf" });
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
    }
  };
  return (
    <div className="flex items-center justify-between gap-x-2">
      <p className="w-[100px] text-sm">{memberName}</p>
      <div className="flex items-center gap-x-2">
        <Button
          className="h-8 text-sm"
          onClick={() => handleGenerate(memberName)}
        >
          Generate
        </Button>
        <Button
          disabled={sendingCertificate}
          className="h-8 text-sm"
          onClick={() => handleSendCertificate(memberName, memberId)}
        >
          {sendingCertificate ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default CertificateComponent;