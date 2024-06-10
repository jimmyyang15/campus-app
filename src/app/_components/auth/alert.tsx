import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { AlertType } from "./signup-form";

const FormAlert = ({ alert }: { alert: AlertType | null }) => {
  if (!alert) return null;
  const { message, desc, status } = alert;
  const isSuccess = status === "success";
  return (
    <Alert variant={isSuccess ? "success" : "destructive"} className="p-2">
      <div className="flex items-start gap-x-2">
        {isSuccess ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <div>
          <AlertTitle className="text-sm md:text-base">{message}</AlertTitle>
          <AlertDescription className="text-xs sm:text-sm">
            {desc}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default FormAlert;
