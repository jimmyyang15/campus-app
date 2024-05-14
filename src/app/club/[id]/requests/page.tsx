"use client";

import RequestList from "@/app/_components/request/request-list";
import { Button } from "@/app/_components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const RequestsPage = () => {
    const router = useRouter()
    const { id } = useParams();
  return (
    <main>
      <Button variant="ghost" onClick={()=>router.back()}>
        <ChevronLeft size={18} className="mr-2" />
        Back
      </Button>
      <p className="text-center text-lg font-bold">Requests</p>
      <RequestList  clubId={id as string}/>
    </main>
  );
};

export default RequestsPage;
