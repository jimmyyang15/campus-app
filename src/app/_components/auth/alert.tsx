import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, CheckCircle2, Terminal } from "lucide-react";
import { AlertType } from "./signup-form";


const FormAlert = ({
  alert,
}: {
  alert:AlertType | null
}) => {
  if (!alert) return null;
  const { message,desc,status } =alert;
  const isSuccess = status==='success'
  return (
    <Alert variant={isSuccess ? "success" : "destructive"}>
      {isSuccess ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <Terminal />
      <AlertTitle>{message}</AlertTitle>
      <AlertDescription>
        {desc}
        </AlertDescription>
    </Alert>
  );
};

export default FormAlert;
