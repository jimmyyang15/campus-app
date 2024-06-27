import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleDownload = (url:string,fileName:string) => {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "downloaded-file";
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error fetching the file:", error);
    });
};

export const getDownloadFileName = (url:string) => {
  return url.split("/").pop()
}

export   function getNextWeekday(weekday: string) {
  const date = new Date();
  const resultDate = new Date(date.getTime());

  // Get the current day of the week (0-6)
  const currentDay = date.getDay();

  // Calculate how many days to add to get to the desired weekday
  const daysToAdd = (Number(weekday) + 7 - currentDay) % 7 || 7;
  console.log(daysToAdd);
  // Add the days to the current date
  resultDate.setDate(date.getDate() + daysToAdd);

  return resultDate;
}