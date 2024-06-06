"use client";
import { api } from "@/trpc/react";
import React from "react";
import Loading from "../loading";
import { Viewer, Worker } from '@react-pdf-viewer/core';

// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
const UserCertificate = () => {
  const { data: certificate, isLoading } =
    api.certificate.getCertificate.useQuery();
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {certificate ? (
           <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.js">
           <div style={{ height: '750px' }}>
               <Viewer
                   fileUrl={certificate.file}
                   plugins={[
                       defaultLayoutPluginInstance,
                   ]}
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
