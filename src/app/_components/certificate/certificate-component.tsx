"use client";

import { pdf } from "@react-pdf/renderer";
import React, { useState } from "react";
import PdfDocument from "./pdf-document";
import { Button } from "../ui/button";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { api } from "@/trpc/react";
import { useEdgeStore } from "@/lib/edgestore";
import { Club } from "@prisma/client";

const CertificateComponent = () => {
  const router = useRouter();
  const { id } = useParams()

  const { data  } = api.club.getMembers.useQuery({
    clubId:id as string
  })
  const { data:club  } = api.club.singleClub.useQuery({
    id:id as string
  });




  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()}>
        <ChevronLeft size={18} className="mr-2" />
        Back
      </Button>
      {/* <button onClick={handleGenerate}>Generate certificate</button> */}
      <p className="text-xl mt-4 font-semibold">Certificates</p>
      {/* <p className="text-center text-lg mt-4">
        Club members
      </p> */}
      <div className="flex flex-col space-y-8  p-2 rounded-lg mt-4 w-3/4 mx-auto">
        {data?.members?.map((member)=>(
           <Item key={member.id} memberId={member.id} memberName={member.profile?.fullName as string} club={club as Club} />
        ))}
       
      </div>
    </div>
  );
};


const Item = ({ memberName,memberId,club }: { memberName:string,memberId:string,club:Club}) => {
  const [sendingCertificate,setSendingCertificate] = useState<boolean>(false)
  const { edgestore } = useEdgeStore();

  const { mutateAsync:sendCertificate } = api.certificate.sendCertificate.useMutation();
  const handleGenerate = async (name:string) => {
    const blob = await pdf(<PdfDocument name={name} clubName={club?.name as string} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleSendCertificate = async(name:string,recipientId:string) => {
    try {
      setSendingCertificate(true)
      const blob = await pdf(<PdfDocument name={name} clubName={club?.name as string} />).toBlob();
      const file = new File([blob], `${name}.pdf`,{type: 'application/pdf'});
      console.log(file)
      const res = await edgestore.publicFiles.upload({
        options:{
          manualFileName:`${name} Certificate.pdf`
        },
        file,
        
        onProgressChange: (progress) => {
          // you can use this to show a progress bar
          console.log(progress);
        },
      });
      await sendCertificate({
        file:res.url,
        recipientId
      
      })
    } catch (error) {
      console.error(error)
    } finally {
      setSendingCertificate(false)
    }
   
  }
  return ( 
    <div  className="flex items-center gap-x-2 justify-between">
    <p className="w-[100px] text-sm">{memberName}</p>
    <div className="flex items-center gap-x-2">
    <Button className="h-8 text-sm" onClick={()=>handleGenerate(memberName)}>Generate</Button>
    <Button disabled={sendingCertificate} className="h-8 text-sm" onClick={()=>handleSendCertificate(memberName,memberId)}>
      {sendingCertificate ? "Sending..." : "Send"}
    </Button>

    </div>
</div>
  )
}


export default CertificateComponent;
