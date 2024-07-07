import React, { useEffect, useRef, useState } from "react";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "../ui/credenza";
import { Button } from "../ui/button";
import { SingleImageDropzone } from "../single-dropzone-image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClubWithPayload } from "@/types";
import { useParams } from "next/navigation";
import axios from "axios";
import { useEdgeStore } from "@/lib/edgestore";
import { toast } from "sonner";
import Loading from "../loading";
import { Input } from "../ui/input";
import moment from "moment";

const UploadSignatureModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>();
  const { edgestore } = useEdgeStore();
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File>();
  useEffect(() => {
    if (!file) {
        setPreview(undefined)
        return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
}, [file])

  const { data: club, isLoading: isLoadingClub } = useQuery<{
    data: ClubWithPayload;
  }>({
    queryKey: ["club"],
    queryFn: () => fetch(`/api/clubs/${id}`).then((res) => res.json()),
  });
  const mentor = club?.data.members.find((member) => member.isMentor);

  const { mutateAsync: uploadSignature } = useMutation({
    mutationFn: (payload: { signatureUrl: string; mentorId: string }) =>
      axios.post(`/api/upload-signature`, payload),
    onSuccess:(data)=>{
      console.log(data)
      toast.success(data.data.message,{
        description: moment().format("LLLL"),
        closeButton: true,
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries(["club"]);
    },
  });

  const handleUploadSignature = async () => {
    // await uploadSignature({
    //     signatureUrl:file
    // })
    try {
      setIsLoading(true);
      if (file) {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            // you can use this to show a progress bar
            console.log(progress);
          },
        });
        await uploadSignature({
          signatureUrl: res.url,
          mentorId: mentor?.id as string,
        });
      } else {
        toast.error("Please provide your signature image", {
          closeButton: true,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      setOpen(false)
    }
  };
  console.log(mentor?.signature);
  return (
    <Credenza onOpenChange={setOpen} open={open}>
      <CredenzaTrigger asChild>
        <Button variant={"outline"}>
          {mentor?.signature ? "Change signature" : "Upload signature"}
        </Button>
      </CredenzaTrigger>

      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle className="text-center">
          {mentor?.signature ? "Change your Signature" : "Upload  your Signature"}

          </CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4 pb-4 text-center text-sm sm:pb-0 sm:text-left">
          <>
            {mentor?.signature ? (
              <div className="flex flex-col items-center justify-center gap-y-2">
                {/* <div className="absolute top-0 bottom-0 right-0 left-0 bg-[#00000048]">

                </div> */}
                {isLoadingClub ? (
                  <Loading />
                ) : (
                  <>
                    <img
                      src={preview ? preview : mentor.signature}
                      className=" h-[100px] w-[100px] rounded-lg object-cover"
                    />

                    <Input
                      onChange={(e) => setFile(e.target.files?.[0])}
                      className="mx-auto w-1/2"
                      id="signature"
                      type="file"
                      accept="image/png,  image/jpeg"
                    />
                  </>
                )}
              </div>
            ) : (
              <SingleImageDropzone
                className="mx-auto w-[100px]"
                width={100}
                height={100}
                value={file}
                onChange={(file) => {
                  setFile(file);
                }}
              />
            )}
          </>

          <div className="flex justify-end">
            <Button
              variant={"outline"}
              onClick={handleUploadSignature}
              disabled={isLoading}
            >
              {isLoading ? "Uploading" : "Upload"}
            </Button>
          </div>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
};

export default UploadSignatureModal;
