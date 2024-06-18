"use client";
import React from "react";
import Loading from "../loading";
import { Viewer, Worker } from "@react-pdf-viewer/core";

// Plugins
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Certificate } from "@prisma/client";
const UserCertificate = () => {
  const { data:certificate,isLoading } = useQuery<{
    data:Certificate
  }>({
    queryKey: ['userCertificate'],
    queryFn: () =>
      fetch('/api/certificates/user-certificate').then((res) =>
        res.json(),
      ),
  })
  
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const router = useRouter();
  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => router.back()} >
        <ChevronLeft size={18} className="mr-2" />
        Back
      </Button>
      <h3>Your certificate</h3>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {certificate?.data ? (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <div style={{ height: "750px" }}>
                <Viewer
                  fileUrl={certificate.data.file}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </div>
            </Worker>
          ) : (
            <p>No certificate yet</p>
          )}
        </>
      )}
    </div>
  );
};


export default UserCertificate;
