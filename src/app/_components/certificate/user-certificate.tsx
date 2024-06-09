"use client";
import { api } from "@/trpc/react";
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
const UserCertificate = () => {
  const { data: certificate, isLoading } =
    api.certificate.getCertificate.useQuery();
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
          {certificate ? (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <div style={{ height: "750px" }}>
                <Viewer
                  fileUrl={certificate.file}
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

const PdfDocument = () => {
  return <div></div>;
};

export default UserCertificate;
